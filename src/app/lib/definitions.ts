export interface clientType{
    id?: string
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

export type TemarioProps = {
    name: string,
    temario: {
        title?: string,
        temas: string[]
    }[]
}
