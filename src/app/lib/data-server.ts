import { createClient } from '../utils/supabase/server';
import {clientType, jobsType, studentType, expenseType, savingsProjectType, projectContributionType, projectExpenseType, clothesType, outfitType, profileType, bodyMeasurementType, exerciseType, routineType, routineExerciseType, vehicleType, vehicleProblemType} from './definitions';

//clients
const fetchClients = async(): Promise <clientType[]> => {
    try {
        const supabase = await createClient();
        const { data: clients } = await supabase.from('clients').select('*').order("egreso", {ascending: false});
        return clients as clientType[]
    } catch (error) {
        console.error("Error: ", error);
        return [];
    }
}

const fetchClientByID = async(id: string): Promise <clientType | null> => {
    try {
        const supabase = await createClient();
        const { data: client, error} = await supabase.from('clients').select('*').eq('id', id).single();
        if (error) throw error;
        return client as clientType
    } catch (error) {
        console.error("Error: ", error);
        return null;
    }
}

const deleteClient = async(id:string) => {
    try {
        const supabase = await createClient();
        const {error} = await supabase.from("client").delete().eq("id", id);
        if (error) throw error;
        console.log("Cliente eliminado");
    } catch (error) {
        console.log("Error al eliminar", error);

    }
}

//------------
//students
const fetchStudents = async(): Promise <studentType[]> => {
    try {
        const supabase = await createClient();
        const { data: clients } = await supabase.from('students').select('*').order("created_at", {ascending: false});
        return clients as studentType[]
    } catch (error) {
        console.error("Error: ", error);
        return [];
    }
}

const fetchStudentByID = async(id: string): Promise <studentType | null> => {
    try {
        const supabase = await createClient();
        const { data: client, error} = await supabase.from('students').select('*').eq('id', id).single();
        if (error) throw error;
        return client as studentType
    } catch (error) {
        console.error("Error: ", error);
        return null;
    }
}

//------------
//students
const fetchJobs = async(): Promise <jobsType[]> => {
    try {
        const supabase = await createClient();
        const { data: jobs } = await supabase.from('jobs').select('*').order("created_at", {ascending: false});
        return jobs as jobsType[]
    } catch (error) {
        console.error("Error: ", error);
        return [];
    }
}

const fetchJobsByID = async(id: string): Promise <jobsType | null> => {
    try {
        const supabase = await createClient();
        const { data: job, error} = await supabase.from('jobs').select('*').eq('id', id).single();
        if (error) throw error;
        return job as jobsType
    } catch (error) {
        console.error("Error: ", error);
        return null;
    }
}

const fetchExpenses = async(): Promise<expenseType[]> => {
    try {
        const supabase = await createClient();
        const { data: expenses } = await supabase.from('expenses').select('*').order('created_at', {ascending: false});
        return expenses as expenseType[]
    } catch (error) {
        console.error("Error: ", error);
        return [];
    }
}

const fetchSavingsProjects = async(): Promise<savingsProjectType[]> => {
    try {
        const supabase = await createClient();
        const { data: projects } = await supabase.from('savings_projects').select('*').order('created_at', {ascending: false});
        return projects as savingsProjectType[]
    } catch (error) {
        console.error("Error: ", error);
        return [];
    }
}

const fetchSavingsProjectById = async(id: string): Promise<savingsProjectType | null> => {
    try {
        const supabase = await createClient();
        const { data: project, error } = await supabase.from('savings_projects').select('*').eq('id', id).single();
        if (error) throw error;
        return project as savingsProjectType
    } catch (error) {
        console.error("Error: ", error);
        return null;
    }
}

const fetchProjectContributions = async(project_id: string): Promise<projectContributionType[]> => {
    try {
        const supabase = await createClient();
        const { data } = await supabase.from('project_contributions').select('*').eq('project_id', project_id).order('created_at', {ascending: false});
        return (data as projectContributionType[]) ?? []
    } catch (error) {
        console.error("Error: ", error);
        return [];
    }
}

const fetchProjectExpenses = async(project_id: string): Promise<projectExpenseType[]> => {
    try {
        const supabase = await createClient();
        const { data } = await supabase.from('project_expenses').select('*').eq('project_id', project_id).order('created_at', {ascending: false});
        return (data as projectExpenseType[]) ?? []
    } catch (error) {
        console.error("Error: ", error);
        return [];
    }
}

const fetchClothes = async(): Promise<clothesType[]> => {
    try {
        const supabase = await createClient();
        const { data: clothes } = await supabase.from('clothes').select('*').order('created_at', {ascending: false});
        return clothes as clothesType[]
    } catch (error) {
        console.error("Error: ", error);
        return [];
    }
}

const fetchOutfits = async(): Promise<outfitType[]> => {
    try {
        const supabase = await createClient();
        const { data: outfits } = await supabase.from('outfits').select('*').order('created_at', {ascending: false});
        return (outfits as outfitType[]) ?? []
    } catch (error) {
        console.error("Error: ", error);
        return [];
    }
}

//------------
//perfil personal
const fetchProfile = async(): Promise<profileType | null> => {
    try {
        const supabase = await createClient();
        const { data, error } = await supabase.from('profile').select('*').limit(1).maybeSingle();
        if (error) throw error;
        return data as profileType | null
    } catch (error) {
        console.error("Error: ", error);
        return null;
    }
}

const fetchBodyMeasurements = async(): Promise<bodyMeasurementType[]> => {
    try {
        const supabase = await createClient();
        const { data } = await supabase.from('body_measurements').select('*').order('date', {ascending: true});
        return (data as bodyMeasurementType[]) ?? []
    } catch (error) {
        console.error("Error: ", error);
        return [];
    }
}

//------------
//gym
const fetchExercises = async(): Promise<exerciseType[]> => {
    try {
        const supabase = await createClient();
        const { data } = await supabase.from('exercises').select('*').order('muscle_group', {ascending: true}).order('name', {ascending: true});
        return (data as exerciseType[]) ?? []
    } catch (error) {
        console.error("Error: ", error);
        return [];
    }
}

const fetchRoutines = async(): Promise<routineType[]> => {
    try {
        const supabase = await createClient();
        const { data } = await supabase.from('routines').select('*').order('created_at', {ascending: false});
        return (data as routineType[]) ?? []
    } catch (error) {
        console.error("Error: ", error);
        return [];
    }
}

const fetchRoutineExercises = async(): Promise<routineExerciseType[]> => {
    try {
        const supabase = await createClient();
        const { data } = await supabase.from('routine_exercises').select('*').order('order', {ascending: true});
        return (data as routineExerciseType[]) ?? []
    } catch (error) {
        console.error("Error: ", error);
        return [];
    }
}

//vehicles
const fetchVehicles = async(): Promise<vehicleType[]> => {
    try {
        const supabase = await createClient();
        const { data } = await supabase.from('vehicles').select('*').order('created_at', {ascending: true});
        return (data ?? []) as vehicleType[]
    } catch (error) {
        console.error("Error: ", error);
        return [];
    }
}

const fetchVehicleProblems = async(): Promise<vehicleProblemType[]> => {
    try {
        const supabase = await createClient();
        const { data } = await supabase.from('vehicle_problems').select('*').order('reported_at', {ascending: false});
        return (data ?? []) as vehicleProblemType[]
    } catch (error) {
        console.error("Error: ", error);
        return [];
    }
}

export {fetchClients, fetchClientByID, deleteClient, fetchStudents, fetchStudentByID, fetchJobs, fetchJobsByID, fetchExpenses, fetchSavingsProjects, fetchSavingsProjectById, fetchProjectContributions, fetchProjectExpenses, fetchClothes, fetchOutfits, fetchProfile, fetchBodyMeasurements, fetchExercises, fetchRoutines, fetchRoutineExercises, fetchVehicles, fetchVehicleProblems};
