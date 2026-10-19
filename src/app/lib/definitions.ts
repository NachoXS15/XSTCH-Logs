import type { CookieOptions } from '@supabase/ssr'

export interface clientType{
    id?: string
    client_name: string
    price: number
    place: string
    service: string
    status: string
    payment: string
    egreso?: string
    obvs?: string
}

export interface studentType{
    id?: number
    student_name: string
    materia: string
    type: string
    price: number
    payment: string
    condition: string
    grade: string
    date: string
    obvs?: string
}

export type searchProp = {
    search: string;
}

export type TemarioProps = {
    name: string,
    temario: {
        title?: string,
        temas: string[]
    }[]
}

export interface jobsType {
    id?: string
    client_name: string
    date: string
    price: number
    active: string
    account: string
    obvs: string
    pay_method?: string
    partner: boolean
    partner_name?: string
}

export type CookieSetup = {
  name: string
  value: string
  options: CookieOptions
}

export interface Service {
  name: string;
  price: number;
}

export interface expenseType {
  id?: string
  name: string
  amount: number
  category: string
  active: boolean
  pay_day?: number | null
  created_at?: string
}

export interface savingsProjectType {
  id?: string
  name: string
  goal_amount: number
  current_amount: number
  description?: string
  deadline?: string
  created_at?: string
}

export interface projectContributionType {
  id?: string
  project_id: string
  amount: number
  note?: string
  created_at?: string
}

export interface projectExpenseType {
  id?: string
  project_id: string
  name: string
  amount: number
  note?: string
  created_at?: string
}

export interface clothesType {
  id?: string
  name: string
  category: string
  condition: "Nuevo" | "Gastado" | "Muy desgastado"
  created_at?: string
}

export interface outfitType {
  id?: string
  name: string
  top_id: string | null
  bottom_id: string | null
  shoes_id: string | null
  created_at?: string
}

// ---- Perfil personal ----
export interface profileType {
  id?: string
  full_name: string
  photo_url?: string | null
  birth_date?: string | null
  height_cm?: number | null
  blood_type?: string | null
  emergency_contact_name?: string | null
  emergency_contact_phone?: string | null
  allergies?: string | null
  chronic_conditions?: string | null
  medications?: string | null
  medical_notes?: string | null
  updated_at?: string
}

export interface bodyMeasurementType {
  id?: string
  date: string
  weight_kg: number
  notes?: string | null
  created_at?: string
}

// ---- Gym ----
export interface exerciseType {
  id?: string
  name: string
  muscle_group: string
  equipment?: string | null
  notes?: string | null
  created_at?: string
}

export interface routineType {
  id?: string
  name: string
  description?: string | null
  active: boolean
  created_at?: string
}

export interface routineExerciseType {
  id?: string
  routine_id: string
  exercise_id: string
  order: number
  sets_target?: number | null
  reps_target?: string | null
  notes?: string | null
}

// ---- Vehículos ----
export interface vehicleType {
  id?: string
  name: string
  type: string
  brand?: string | null
  model?: string | null
  year?: number | null
  plate?: string | null
  color?: string | null
  fuel?: string | null
  mileage_km?: number | null
  vin?: string | null
  engine_number?: string | null
  insurance_company?: string | null
  insurance_policy?: string | null
  insurance_expiry?: string | null
  vtv_expiry?: string | null
  notes?: string | null
  created_at?: string
}

export type vehicleProblemStatus = "Pendiente" | "Arreglado"

export interface vehicleProblemType {
  id?: string
  vehicle_id: string
  title: string
  description?: string | null
  status: vehicleProblemStatus
  reported_at: string
  fixed_at?: string | null
  cost?: number | null
  created_at?: string
}
