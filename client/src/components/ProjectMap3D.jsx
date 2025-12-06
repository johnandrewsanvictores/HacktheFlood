import { useEffect, useRef } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

mapboxgl.accessToken = import.meta.env.VITE_MAP_TOKEN || 'pk.eyJ1IjoiamRyZXd3IiwiYSI6ImNtaHMzZjFrZzBkeWYyb3NkbnllOXFtbW0ifQ.pMqCXOknQOavqXUo1DBZmw';

const ProjectMap3D = ({ projects = [], selectedProject = null, onProjectSelect = null, loading = false }) => {
    const mapContainer = useRef(null);
    const map = useRef(null);
    const markersRef = useRef([]);

    useEffect(() => {
        if (!mapContainer.current || loading) return;

        if (!map.current) {
            map.current = new mapboxgl.Map({
                container: mapContainer.current,
                style: 'mapbox://styles/mapbox/satellite-streets-v12',
                center: [122.0, 12.0],
                zoom: 5.5,
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
    }, [projects, loading]);

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

