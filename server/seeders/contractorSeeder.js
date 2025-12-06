import Contractor from '../models/Contractor.js';

const seedContractors = async () => {
    try {
        await Contractor.deleteMany({});

        const contractors = [
            {
                company_name: 'AZARRAGA CONSTRUCTION',
                contract_ids: ['24EG0058'],
                total_projects: 1,
                completed_projects: 1,
                ongoing_projects: 0,
                total_contract_value: 17961569.07,
                success_rate: 100,
                credit_score: 75,
                average_completion_time_days: 97,
                on_time_completion_rate: 100,
                budget_adherence_rate: 99.99,
                location_preferences: [
                    {
                        region: 'Region IV-B',
                        district: 'PALAWAN (THIRD LEGISLATIVE DISTRICT)',
                        project_count: 1
                    }
                ],
                project_type_expertise: [
                    {
                        type_of_work: 'Construction of Flood Mitigation Structure',
                        project_count: 1,
                        success_rate: 100
                    }
                ],
                verified: true
            },
            {
                company_name: 'ABC CONSTRUCTION COMPANY',
                contract_ids: [],
                total_projects: 3,
                completed_projects: 2,
                ongoing_projects: 1,
                total_contract_value: 45000000,
                success_rate: 85,
                credit_score: 65,
                average_completion_time_days: 120,
                on_time_completion_rate: 75,
                budget_adherence_rate: 92,
                location_preferences: [
                    {
                        region: 'NCR',
                        district: 'MANILA (FIRST LEGISLATIVE DISTRICT)',
                        project_count: 2
                    },
                    {
                        region: 'Region IV-A',
                        district: 'LAGUNA (SECOND LEGISLATIVE DISTRICT)',
                        project_count: 1
                    }
                ],
                project_type_expertise: [
                    {
                        type_of_work: 'Construction of Flood Mitigation Structure',
                        project_count: 2,
                        success_rate: 90
                    },
                    {
                        type_of_work: 'River Channel Improvement',
                        project_count: 1,
                        success_rate: 75
                    }
                ],
                verified: true
            },
            {
                company_name: 'XYZ INFRASTRUCTURE BUILDERS',
                contract_ids: [],
                total_projects: 5,
                completed_projects: 4,
                ongoing_projects: 1,
                total_contract_value: 125000000,
                success_rate: 95,
                credit_score: 88,
                average_completion_time_days: 95,
                on_time_completion_rate: 90,
                budget_adherence_rate: 98,
                location_preferences: [
                    {
                        region: 'Region III',
                        district: 'PAMPANGA (FIRST LEGISLATIVE DISTRICT)',
                        project_count: 3
                    },
                    {
                        region: 'Region IV-A',
                        district: 'BATANGAS (SECOND LEGISLATIVE DISTRICT)',
                        project_count: 2
                    }
                ],
                project_type_expertise: [
                    {
                        type_of_work: 'Construction of Flood Mitigation Structure',
                        project_count: 3,
                        success_rate: 95
                    },
                    {
                        type_of_work: 'Drainage System Improvement',
                        project_count: 2,
                        success_rate: 95
                    }
                ],
                verified: true
            },
            {
                company_name: 'PHANTOM BUILDERS CORP',
                contract_ids: [],
                total_projects: 4,
                completed_projects: 0,
                ongoing_projects: 4,
                total_contract_value: 95000000,
                success_rate: 0,
                credit_score: 15,
                average_completion_time_days: 0,
                on_time_completion_rate: 0,
                budget_adherence_rate: 45,
                location_preferences: [
                    {
                        region: 'Region V',
                        district: 'ALBAY (FIRST LEGISLATIVE DISTRICT)',
                        project_count: 4
                    }
                ],
                project_type_expertise: [
                    {
                        type_of_work: 'Construction of Flood Mitigation Structure',
                        project_count: 4,
                        success_rate: 0
                    }
                ],
                verified: false
            },
            {
                company_name: 'SHADOW CONSTRUCTION INC',
                contract_ids: [],
                total_projects: 6,
                completed_projects: 1,
                ongoing_projects: 5,
                total_contract_value: 180000000,
                success_rate: 16,
                credit_score: 22,
                average_completion_time_days: 0,
                on_time_completion_rate: 0,
                budget_adherence_rate: 52,
                location_preferences: [
                    {
                        region: 'Region VI',
                        district: 'ILOILO (FIRST LEGISLATIVE DISTRICT)',
                        project_count: 6
                    }
                ],
                project_type_expertise: [
                    {
                        type_of_work: 'Construction of Flood Mitigation Structure',
                        project_count: 4,
                        success_rate: 0
                    },
                    {
                        type_of_work: 'River Channel Improvement',
                        project_count: 2,
                        success_rate: 50
                    }
                ],
                verified: false
            },
            {
                company_name: 'QUICK MONEY BUILDERS',
                contract_ids: [],
                total_projects: 3,
                completed_projects: 0,
                ongoing_projects: 3,
                total_contract_value: 75000000,
                success_rate: 0,
                credit_score: 8,
                average_completion_time_days: 0,
                on_time_completion_rate: 0,
                budget_adherence_rate: 38,
                location_preferences: [
                    {
                        region: 'Region VII',
                        district: 'CEBU (SECOND LEGISLATIVE DISTRICT)',
                        project_count: 3
                    }
                ],
                project_type_expertise: [
                    {
                        type_of_work: 'Construction of Flood Mitigation Structure',
                        project_count: 3,
                        success_rate: 0
                    }
                ],
                verified: false
            },
            {
                company_name: 'RELIABLE FLOOD CONTROL SERVICES',
                contract_ids: [],
                total_projects: 8,
                completed_projects: 7,
                ongoing_projects: 1,
                total_contract_value: 210000000,
                success_rate: 92,
                credit_score: 82,
                average_completion_time_days: 110,
                on_time_completion_rate: 87,
                budget_adherence_rate: 94,
                location_preferences: [
                    {
                        region: 'Region VIII',
                        district: 'LEYTE (FIRST LEGISLATIVE DISTRICT)',
                        project_count: 5
                    },
                    {
                        region: 'Region VIII',
                        district: 'SAMAR (SECOND LEGISLATIVE DISTRICT)',
                        project_count: 3
                    }
                ],
                project_type_expertise: [
                    {
                        type_of_work: 'Construction of Flood Mitigation Structure',
                        project_count: 5,
                        success_rate: 90
                    },
                    {
                        type_of_work: 'Drainage System Improvement',
                        project_count: 3,
                        success_rate: 95
                    }
                ],
                verified: true
            },
            {
                company_name: 'SUSPICIOUS INFRASTRUCTURE GROUP',
                contract_ids: [],
                total_projects: 5,
                completed_projects: 1,
                ongoing_projects: 4,
                total_contract_value: 140000000,
                success_rate: 20,
                credit_score: 18,
                average_completion_time_days: 0,
                on_time_completion_rate: 0,
                budget_adherence_rate: 42,
                location_preferences: [
                    {
                        region: 'Region IX',
                        district: 'ZAMBOANGA DEL NORTE (FIRST LEGISLATIVE DISTRICT)',
                        project_count: 5
                    }
                ],
                project_type_expertise: [
                    {
                        type_of_work: 'Construction of Flood Mitigation Structure',
                        project_count: 5,
                        success_rate: 20
                    }
                ],
                verified: false
            },
            {
                company_name: 'GHOST PROJECT CONSTRUCTION',
                contract_ids: [],
                total_projects: 7,
                completed_projects: 0,
                ongoing_projects: 7,
                total_contract_value: 165000000,
                success_rate: 0,
                credit_score: 5,
                average_completion_time_days: 0,
                on_time_completion_rate: 0,
                budget_adherence_rate: 28,
                location_preferences: [
                    {
                        region: 'Region X',
                        district: 'MISAMIS ORIENTAL (FIRST LEGISLATIVE DISTRICT)',
                        project_count: 7
                    }
                ],
                project_type_expertise: [
                    {
                        type_of_work: 'Construction of Flood Mitigation Structure',
                        project_count: 4,
                        success_rate: 0
                    },
                    {
                        type_of_work: 'River Channel Improvement',
                        project_count: 3,
                        success_rate: 0
                    }
                ],
                verified: false
            },
            {
                company_name: 'TRUSTWORTHY BUILDERS PH',
                contract_ids: [],
                total_projects: 6,
                completed_projects: 6,
                ongoing_projects: 0,
                total_contract_value: 195000000,
                success_rate: 100,
                credit_score: 92,
                average_completion_time_days: 98,
                on_time_completion_rate: 95,
                budget_adherence_rate: 97,
                location_preferences: [
                    {
                        region: 'Region XI',
                        district: 'DAVAO DEL SUR (FIRST LEGISLATIVE DISTRICT)',
                        project_count: 3
                    },
                    {
                        region: 'Region XI',
                        district: 'DAVAO DEL NORTE (SECOND LEGISLATIVE DISTRICT)',
                        project_count: 3
                    }
                ],
                project_type_expertise: [
                    {
                        type_of_work: 'Construction of Flood Mitigation Structure',
                        project_count: 4,
                        success_rate: 100
                    },
                    {
                        type_of_work: 'Drainage System Improvement',
                        project_count: 2,
                        success_rate: 100
                    }
                ],
                verified: true
            }
        ];

        const createdContractors = await Contractor.insertMany(contractors);
        console.log(`${createdContractors.length} contractors seeded successfully`);
        return createdContractors;
    } catch (error) {
        console.error('Error seeding contractors:', error);
        throw error;
    }
};

export default seedContractors;

