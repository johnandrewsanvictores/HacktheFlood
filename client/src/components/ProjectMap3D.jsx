import { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import api from '../../axios';

mapboxgl.accessToken = import.meta.env.VITE_MAP_TOKEN || 'pk.eyJ1IjoiamRyZXd3IiwiYSI6ImNtaHMzZjFrZzBkeWYyb3NkbnllOXFtbW0ifQ.pMqCXOknQOavqXUo1DBZmw';

const ProjectMap3D = ({ projects = [], selectedProject = null, onProjectSelect = null, loading = false }) => {
    const mapContainer = useRef(null);
    const map = useRef(null);
    const markersRef = useRef([]);
    const userLocationMarkerRef = useRef(null);
    const directionsLayersRef = useRef([]);
    const [userLocation, setUserLocation] = useState(null);

    const calculateDistance = (lat1, lon1, lat2, lon2) => {
        const R = 6371;
        const dLat = (lat2 - lat1) * Math.PI / 180;
        const dLon = (lon2 - lon1) * Math.PI / 180;
        const a = 
            Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
            Math.sin(dLon / 2) * Math.sin(dLon / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return R * c;
    };

    useEffect(() => {
        const fetchUserLocation = async () => {
            try {
                const response = await api.get('/auth/user/profile');
                if (response.data?.user?.latitude && response.data?.user?.longitude) {
                    setUserLocation({
                        latitude: response.data.user.latitude,
                        longitude: response.data.user.longitude
                    });
                } else {
                    if (navigator.geolocation) {
                        navigator.geolocation.getCurrentPosition(
                            (position) => {
                                setUserLocation({
                                    latitude: position.coords.latitude,
                                    longitude: position.coords.longitude
                                });
                            },
                            (error) => {
                                console.error('Error getting location:', error);
                            },
                            {
                                enableHighAccuracy: true,
                                timeout: 10000,
                                maximumAge: 0
                            }
                        );
                    }
                }
            } catch (error) {
                console.error('Error fetching user profile:', error);
                if (navigator.geolocation) {
                    navigator.geolocation.getCurrentPosition(
                        (position) => {
                            setUserLocation({
                                latitude: position.coords.latitude,
                                longitude: position.coords.longitude
                            });
                        },
                        (error) => {
                            console.error('Error getting location:', error);
                        },
                        {
                            enableHighAccuracy: true,
                            timeout: 10000,
                            maximumAge: 0
                        }
                    );
                }
            }
        };

        fetchUserLocation();
    }, []);

    useEffect(() => {
        if (!mapContainer.current || loading) return;

        if (!map.current) {
            const initialCenter = userLocation 
                ? [userLocation.longitude, userLocation.latitude]
                : [122.0, 12.0];
            const initialZoom = userLocation ? 12 : 5.5;

            map.current = new mapboxgl.Map({
                container: mapContainer.current,
                style: 'mapbox://styles/mapbox/satellite-streets-v12',
                center: initialCenter,
                zoom: initialZoom,
                pitch: 45,
                bearing: -17.6,
                antialias: true
            });

            map.current.on('load', () => {
                if (!map.current) return;

                map.current.addSource('mapbox-dem', {
                    type: 'raster-dem',
                    url: 'mapbox://mapbox.mapbox-terrain-dem-v1',
                    tileSize: 512,
                    maxzoom: 14
                });

                map.current.setTerrain({ source: 'mapbox-dem', exaggeration: 1.5 });

                if (projects.length > 0) {
                    const geoJsonData = {
                        type: 'FeatureCollection',
                        features: projects.map(project => ({
                        type: 'Feature',
                        geometry: {
                            type: 'Point',
                            coordinates: [project.longitude, project.latitude]
                        },
                        properties: {
                            id: project._id,
                            name: project.project_name,
                            status: project.status,
                            riskScore: project.risk_score,
                            isFlagged: project.is_flagged,
                            contractorName: project.contractor_name,
                            approvedBudget: project.approved_budget,
                            contractCost: project.contract_cost,
                            projectId: project.project_id,
                            typeOfWork: project.type_of_work,
                            region: project.region,
                            startDate: project.start_date,
                            completionDate: project.completion_date_actual
                        }
                    }))
                };

                map.current.addSource('projects', {
                    type: 'geojson',
                    data: geoJsonData,
                    cluster: true,
                    clusterMaxZoom: 14,
                    clusterRadius: 50
                });

                map.current.addLayer({
                    id: 'unclustered-point',
                    type: 'circle',
                    source: 'projects',
                    filter: ['!', ['has', 'point_count']],
                    paint: {
                        'circle-color': [
                            'case',
                            ['get', 'isFlagged'],
                            '#ef4444',
                            ['==', ['get', 'status'], 'finished'],
                            '#22c55e',
                            ['==', ['get', 'status'], 'ongoing'],
                            '#3b82f6',
                            '#9ca3af'
                        ],
                        'circle-radius': [
                            'interpolate',
                            ['linear'],
                            ['zoom'],
                            5, 8,
                            10, 12,
                            15, 20
                        ],
                        'circle-stroke-width': 2,
                        'circle-stroke-color': '#fff'
                    }
                });

                map.current.addLayer({
                    id: 'cluster-count',
                    type: 'symbol',
                    source: 'projects',
                    filter: ['has', 'point_count'],
                    layout: {
                        'text-field': '{point_count_abbreviated}',
                        'text-font': ['DIN Offc Pro Medium', 'Arial Unicode MS Bold'],
                        'text-size': 12
                    },
                    paint: {
                        'text-color': '#ffffff'
                    }
                });

                map.current.addLayer({
                    id: 'cluster',
                    type: 'circle',
                    source: 'projects',
                    filter: ['has', 'point_count'],
                    paint: {
                        'circle-color': [
                            'step',
                            ['get', 'point_count'],
                            '#51bbd6',
                            10,
                            '#f1f075',
                            30,
                            '#f28cb1'
                        ],
                        'circle-radius': [
                            'step',
                            ['get', 'point_count'],
                            20,
                            10,
                            30,
                            30,
                            40
                        ]
                    }
                });

                map.current.on('click', 'unclustered-point', (e) => {
                    const coordinates = e.features[0].geometry.coordinates.slice();
                    const properties = e.features[0].properties;

                    const foundProject = projects.find(p => p._id === properties.id);
                    if (foundProject && onProjectSelect) {
                        onProjectSelect(foundProject);
                    }

                    while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
                        coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
                    }

                    new mapboxgl.Popup()
                        .setLngLat(coordinates)
                        .setHTML(`
                            <div class="p-3">
                                <h3 class="font-bold text-lg mb-2">${properties.name}</h3>
                                <p class="text-sm mb-1"><strong>Status:</strong> <span class="capitalize">${properties.status}</span></p>
                                <p class="text-sm mb-1"><strong>Risk Score:</strong> ${properties.riskScore}</p>
                                <p class="text-sm mb-1"><strong>Contractor:</strong> ${properties.contractorName}</p>
                                <p class="text-xs mt-2 text-gray-500">Click for more details</p>
                            </div>
                        `)
                        .addTo(map.current);
                });

                map.current.on('click', 'cluster', (e) => {
                    const features = map.current.queryRenderedFeatures(e.point, {
                        layers: ['cluster']
                    });
                    const clusterId = features[0].properties.cluster_id;
                    
                    map.current.getSource('projects').getClusterExpansionZoom(
                        clusterId,
                        (err, zoom) => {
                            if (err) return;

                            map.current.easeTo({
                                center: features[0].geometry.coordinates,
                                zoom: zoom
                            });
                        }
                    );
                });

                map.current.on('mouseenter', 'unclustered-point', () => {
                    map.current.getCanvas().style.cursor = 'pointer';
                });

                map.current.on('mouseleave', 'unclustered-point', () => {
                    map.current.getCanvas().style.cursor = '';
                });
                }
            });
        } else {
            if (map.current.getSource('projects')) {
                const geoJsonData = {
                    type: 'FeatureCollection',
                    features: projects.map(project => ({
                        type: 'Feature',
                        geometry: {
                            type: 'Point',
                            coordinates: [project.longitude, project.latitude]
                        },
                        properties: {
                            id: project._id,
                            name: project.project_name,
                            status: project.status,
                            riskScore: project.risk_score,
                            isFlagged: project.is_flagged,
                            contractorName: project.contractor_name,
                            approvedBudget: project.approved_budget,
                            contractCost: project.contract_cost,
                            projectId: project.project_id,
                            typeOfWork: project.type_of_work,
                            region: project.region,
                            startDate: project.start_date,
                            completionDate: project.completion_date_actual
                        }
                    }))
                };
                map.current.getSource('projects').setData(geoJsonData);
            }
        }

        return () => {
            if (map.current) {
                map.current.remove();
                map.current = null;
            }
            markersRef.current.forEach(marker => marker.remove());
            markersRef.current = [];
        };
    }, [projects, loading, userLocation]);

    useEffect(() => {
        if (!map.current || !userLocation) return;

        if (userLocationMarkerRef.current) {
            userLocationMarkerRef.current.remove();
        }

        const el = document.createElement('div');
        el.className = 'user-location-marker';
        el.style.width = '20px';
        el.style.height = '20px';
        el.style.borderRadius = '50%';
        el.style.backgroundColor = '#3b82f6';
        el.style.border = '3px solid white';
        el.style.boxShadow = '0 2px 8px rgba(0,0,0,0.3)';
        el.style.cursor = 'pointer';

        userLocationMarkerRef.current = new mapboxgl.Marker(el)
            .setLngLat([userLocation.longitude, userLocation.latitude])
            .setPopup(new mapboxgl.Popup().setHTML('<div class="p-2"><strong>Your Location</strong></div>'))
            .addTo(map.current);

        if (map.current.getZoom() < 10) {
            map.current.flyTo({
                center: [userLocation.longitude, userLocation.latitude],
                zoom: 12,
                duration: 1000
            });
        }
    }, [userLocation]);

    useEffect(() => {
        if (!map.current || !userLocation || !projects.length) return;

        const removeDirections = () => {
            directionsLayersRef.current.forEach(id => {
                if (map.current.getLayer(id)) {
                    map.current.removeLayer(id);
                }
                if (map.current.getSource(id)) {
                    map.current.removeSource(id);
                }
            });
            directionsLayersRef.current = [];
        };

        removeDirections();

        const nearbyProjects = projects
            .filter(project => project.latitude && project.longitude)
            .map(project => {
                const distance = calculateDistance(
                    userLocation.latitude,
                    userLocation.longitude,
                    project.latitude,
                    project.longitude
                );
                return { ...project, distance };
            })
            .sort((a, b) => a.distance - b.distance)
            .slice(0, 5);

        nearbyProjects.forEach((project, index) => {
            const sourceId = `route-${project._id}`;
            const layerId = `route-${project._id}`;

            const url = `https://api.mapbox.com/directions/v5/mapbox/driving/${userLocation.longitude},${userLocation.latitude};${project.longitude},${project.latitude}?geometries=geojson&access_token=${mapboxgl.accessToken}`;

            fetch(url)
                .then(response => response.json())
                .then(data => {
                    if (data.code === 'Ok' && data.routes && data.routes.length > 0) {
                        const route = data.routes[0].geometry;

                        if (!map.current.getSource(sourceId)) {
                            map.current.addSource(sourceId, {
                                type: 'geojson',
                                data: {
                                    type: 'Feature',
                                    geometry: route,
                                    properties: {
                                        distance: data.routes[0].distance,
                                        duration: data.routes[0].duration
                                    }
                                }
                            });

                            map.current.addLayer({
                                id: layerId,
                                type: 'line',
                                source: sourceId,
                                layout: {
                                    'line-join': 'round',
                                    'line-cap': 'round'
                                },
                                paint: {
                                    'line-color': index === 0 ? '#3b82f6' : '#60a5fa',
                                    'line-width': index === 0 ? 4 : 3,
                                    'line-opacity': index === 0 ? 0.8 : 0.5
                                }
                            });

                            if (!directionsLayersRef.current.includes(layerId)) {
                                directionsLayersRef.current.push(layerId);
                            }
                            if (!directionsLayersRef.current.includes(sourceId)) {
                                directionsLayersRef.current.push(sourceId);
                            }
                        }
                    }
                })
                .catch(error => {
                    console.error('Error fetching directions:', error);
                });
        });

        return () => {
            removeDirections();
        };
    }, [userLocation, projects, selectedProject]);

    useEffect(() => {
        if (selectedProject && map.current) {
            map.current.flyTo({
                center: [selectedProject.longitude, selectedProject.latitude],
                zoom: 12,
                duration: 1000
            });
        }
    }, [selectedProject]);

    if (loading) {
        return (
            <div className="w-full h-full flex items-center justify-center">
                <div className="text-lg">Loading map...</div>
            </div>
        );
    }

    return (
        <div className="w-full h-full relative">
            <div ref={mapContainer} className="w-full h-full" />
        </div>
    );
};

export default ProjectMap3D;

