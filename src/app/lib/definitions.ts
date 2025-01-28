export interface clientType{
    client_name: string
    price: number
    place: string
    service: string
    status: string
    payment: string
    egreso: string
    obvs?: string
}

export type searchProp = {
    search: string;
}