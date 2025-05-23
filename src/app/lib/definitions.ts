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