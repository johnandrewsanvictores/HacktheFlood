import { useEffect, useRef } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

mapboxgl.accessToken = import.meta.env.VITE_MAP_TOKEN || 'pk.eyJ1IjoiamRyZXd3IiwiYSI6ImNtaHMzZjFrZzBkeWYyb3NkbnllOXFtbW0ifQ.pMqCXOknQOavqXUo1DBZmw';

const getModelForInfrastructure = (infrastructureType, typeOfWork) => {
    const type = (infrastructureType || '').toLowerCase();
    const work = (typeOfWork || '').toLowerCase();
    
    if (type.includes('flood') || work.includes('flood')) {
        return 'https://docs.mapbox.com/mapbox-gl-js/assets/wind_turbine_static.glb';
    }
    if (type.includes('bridge') || work.includes('bridge')) {
        return 'https://docs.mapbox.com/mapbox-gl-js/assets/wind_turbine_static.glb';
    }
    if (type.includes('drainage') || work.includes('drainage')) {
        return 'https://docs.mapbox.com/mapbox-gl-js/assets/wind_turbine_static.glb';
    }
    if (type.includes('road') || work.includes('road')) {
        return 'https://docs.mapbox.com/mapbox-gl-js/assets/wind_turbine_static.glb';
    }
    
    return 'https://docs.mapbox.com/mapbox-gl-js/assets/wind_turbine_static.glb';
};

const ProjectMap3DModel = ({ project }) => {
    const mapContainer = useRef(null);
    const map = useRef(null);

    useEffect(() => {
        if (!mapContainer.current || !project) return;

        if (!map.current) {
            const modelUrl = getModelForInfrastructure(project.infrastructure_type, project.type_of_work);
            
            const geoJsonData = {
                type: 'FeatureCollection',
                features: [{
                    type: 'Feature',
                    properties: {
                        project_id: project.project_id,
                        project_name: project.project_name,
                        status: project.status,
                        infrastructure_type: project.infrastructure_type,
                        type_of_work: project.type_of_work
                    },
                    geometry: {
                        type: 'Point',
                        coordinates: [project.longitude, project.latitude]
                    }
                }]
            };

            const style = {
                version: 8,
                imports: [{
                    id: 'basemap',
                    url: 'mapbox://styles/mapbox/standard',
                    config: {
                        lightPreset: 'dusk',
                        showPointofInterestLabels: false,
                        showPlaceLabels: false,
                        showRoadLabels: false
                    }
                }],
                sources: {
                    'mapbox-dem': {
                        type: 'raster-dem',
                        url: 'mapbox://mapbox.mapbox-terrain-dem-v1',
                        tileSize: 512,
                        maxzoom: 14
                    },
                    'project-source': {
                        type: 'geojson',
                        data: geoJsonData
                    }
                },
                terrain: {
                    source: 'mapbox-dem',
                    exaggeration: 1.5
                },
                models: {
                    'infrastructure': modelUrl
                },
                layers: [{
                    type: 'model',
                    source: 'project-source',
                    paint: {
                        'model-scale': [1, 1, 1],
                        'model-color': project.is_flagged ? '#ef4444' : 
                                      project.status === 'finished' ? '#22c55e' :
                                      project.status === 'ongoing' ? '#3b82f6' : '#9ca3af',
                        'model-color-mix-intensity': project.is_flagged ? 0.5 : 0.2,
                        'model-rotation': [0, 0, 0]
                    },
                    id: 'project-model',
                    layout: {
                        'model-id': 'infrastructure'
                    }
                }, {
                    type: 'symbol',
                    source: 'project-source',
                    id: 'project-label',
                    layout: {
                        'text-field': [
                            'format',
                            ['get', 'project_name'],
                            { 'font-scale': 1.2, 'text-color': '#ffffff' },
                            '\n',
                            {},
                            ['get', 'status'],
                            { 'font-scale': 0.9, 'text-color': '#ffffff' }
                        ],
                        'text-font': ['Open Sans Semibold', 'Arial Unicode MS Bold'],
                        'text-size': 12,
                        'text-anchor': 'top'
                    },
                    paint: {
                        'text-color': '#ffffff',
                        'text-halo-color': '#000000',
                        'text-halo-width': 2
                    }
                }]
            };

            map.current = new mapboxgl.Map({
                container: mapContainer.current,
                projection: 'globe',
                style: style,
                center: [project.longitude, project.latitude],
                zoom: 16,
                bearing: 0,
                pitch: 60
            });

            map.current.on('load', () => {
                if (!map.current) return;
            });
        } else {
            if (map.current.getSource('project-source')) {
                const geoJsonData = {
                    type: 'FeatureCollection',
                    features: [{
                        type: 'Feature',
                        properties: {
                            project_id: project.project_id,
                            project_name: project.project_name,
                            status: project.status,
                            infrastructure_type: project.infrastructure_type,
                            type_of_work: project.type_of_work
                        },
                        geometry: {
                            type: 'Point',
                            coordinates: [project.longitude, project.latitude]
                        }
                    }]
                };
                map.current.getSource('project-source').setData(geoJsonData);
            }
            
            map.current.flyTo({
                center: [project.longitude, project.latitude],
                zoom: 16,
                pitch: 60,
                duration: 1000
            });
        }

        return () => {
            if (map.current) {
                map.current.remove();
                map.current = null;
            }
        };
    }, [project]);

    if (!project) {
        return (
            <div className="w-full h-full flex items-center justify-center bg-gray-100">
                <div className="text-gray-500">No project selected</div>
            </div>
        );
    }

    return (
        <div className="w-full h-full relative">
            <div ref={mapContainer} className="w-full h-full" />
        </div>
    );
};

export default ProjectMap3DModel;

