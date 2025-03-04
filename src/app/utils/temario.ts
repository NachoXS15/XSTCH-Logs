import { TemarioProps } from '../lib/definitions'


const TemasCatedras: TemarioProps[] = [
    {
        name: "Fundamentos de Programación",
        temario: [{
                "title": "Pseint",
                "temas": [
                    "Introducción al codigo y pseudocódigo.",
                    "Conceptos de algoritmos.",
                    "Guia por la interfaz de Pseint.",
                    "Variables y tipos de datos",
                    "Funciones basicas: escribir, leer y asignar.",
                    "Estructuras condicionales: si-entonces y según.",
                    "Operadores lógicos.",
                    "Estructuras repetitivas: do-while y while",
                    "Mayor y Menor.",
                    "Estructura For.",
                    "Arrays unidimensionales (vectores).",
                    "Arrays Multidimensionales (matrices). /LIBRES."
                ]

        }]
    },
    {
        name: "Programación I",
        temario: [
            {
                "title": "HTML - Hyper Text Markup Lenguage",
                "temas": [
                    "Introducción y usos",
                    "Etiquetas, atributos, contenidos y valores",
                    "Etiquetas de Texto",
                    "Etiquetas semánticas",
                    "Etiquetas de Enlace",
                    "Rutas absolutas y relativas",
                    "Imágenes",
                    "Etiquetas de línea y bloque",
                    "Listas ordenadas y desordenadas",
                    "Tablas, columnas y filas",
                    "Formularios"
                ]
            },
            {
                "title": "CSS - Cascading Style Sheet",
                "temas": [
                    "Introducción y usos",
                    "Frameworks",
                    "Conexión con HTML.",
                    "Selectores.",
                    "Ámbitos de uso.",
                    "Herencia y reglas.",
                    "Estilos a cajas y textos.",
                    "Colores",
                    "Unidades de medida y colores.",
                    "Box Model (ancho y alto, margin, padding y border).",
                    "Imágenes.",
                    "Posicionamiento (position, float y flexbox)."
                ]
            },
        ]
    },
    {
        name: "Programación II",
        temario: [
            {
                "title": "PHP - HyperText Preprocessor",
                "temas": [
                    "Introducción.",
                    "Qué es programación dinámica.",
                    "Qué es PHP, un interprete y XAMPP.",
                    "Comparación con Fundamentos de Programación.",
                    "Qué es una variable.",
                    "Tipos de datos en PHP.",
                    "Qué es un array unidimensional y multidimensional.",
                    "Condicionales, if y switch statements.",
                    "Tipos de igualdad.",
                    "Operadores lógicos.",
                    "Estructuras repetitivas: for, while y foreach.",
                    "Variables SESSION, GET y POST",
                    "Validación de datos y usuarios",
                    "Buscador"
                ]
            },
            {
                "title": "SQL - Structured Query Lenguage",
                "temas": [
                    "Introducción.",
                    "Qué es una base de datos.",
                    "Comparación con Excel (tablas).",
                    "Introducción a PhpMyAdmin (GUI).",
                    "Creación de base de datos y manejo de tablas.",
                    "Tipos de datos.",
                    "Claves primarias y foraneas.",
                    "Instrucciones y consultas.",
                    "Código de SQL y relación con PHP.",
                    "Importar, insertar y exportar.",
                    "Consultas select, insert, update y delete"
                ]
            },
            {
                "title": "JavaScript",
                "temas": [
                    "Introducción.",
                    "Variables",
                    "Tipos de datos",
                    "Manejo de DOM",
                    "Validación de formularios"
                ]
            },
        ]
    },
    
    {
        name: "Ingles I",
        temario: [
            {
                title: "General",
                temas: [
                    "Interpretación de textos",
                    "Pronombres, Posesivos, WH-words",
                    "Sustantivos"
                ]
            },
            {
                title: "Estructuras de oraciones",
                temas: [
                    "Afirmación",
                    "Negación",
                    "Pregunta"
                ]
            },
            {
                title: "Adjetivos",
                temas: [
                    "Descriptivos",
                    "de Grado Superlativo",
                    "de Grado Comparativo"
                ]
            },
            {
                title: "Verbos",
                temas: [
                    "Tiempos verbales",
                    "Pasado Simple y Pasado Participio",
                    "Frases Verbales",
                    "Verbos Modales",
                    "Voz Pasiva"
                ]
            },
        ]
    },
    {
        name: "Seminario de Actualización",
        temario: [
            {
                title: "Introducción",
                temas: [
                    "Android: Caracteristicas y Funcionalidades",
                    "Introducción a Android Studio, su interfaz, plugins y posibilidades",
                    "Activities y su ciclo de vida"
                ]
            },
            {
                title: "Java",
                temas: [
                    "Clases",
                    "Scope",
                    "Funciones",
                    "Objetos",
                    "Paquetes",
                    "Archivos Build.Gradle"
                ]
            },
            {
                title: "XML",
                temas: [
                    "Etiquetas",
                    "Relación/Comparación con HTML",
                    "Atributos",
                    "Views",
                    "Layouts",
                    "Estilos",
                ]
            },
        ]
    },
]

export default TemasCatedras