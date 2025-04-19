export enum AgentRole {
  Admin = 'Admin',
  Professional = 'Professional',
  Agent = 'Agent',
}

export const AGENT_PRIVILEGES = [AgentRole.Professional, AgentRole.Agent];

export const StrongPasswordRegx: RegExp =
  /^(?=[^A-Z]*[A-Z])(?=[^a-z]*[a-z])(?=\D*\d)(?=.*[!@#$%^&*]).{8,}$/;

export const HONDURAS_DEPARTMENTS = [
  'Atlántida',
  'Colón',
  'Comayagua',
  'Copán',
  'Cortés',
  'Choluteca',
  'El Paraíso',
  'Francisco Morazán',
  'Gracias a Dios',
  'Intibucá',
  'Islas de la Bahía',
  'La Paz',
  'Lempira',
  'Ocotepeque',
  'Olancho',
  'Santa Bárbara',
  'Valle',
  'Yoro',
];

export const MAJOR_OPTIONS = [
'No Aplica UNAH',
'Medicina y Cirugia',
'Licenciatura en Psicologia',
'Odontologia ',
'Licenciatura en Enfermeria',
'Licenciatura en Pedagogia',
'Ingenieria Civil',
'Ingenieria Mecanica Industrial',
'Ingenieria Electrica Industrial',
'Ingenieria Industrial',
'Ingenieria en Sistemas',
'Licenciatura en Derecho',
'Licenciatura en Administracion de Empresas',
'Licenciatura en Contaduria Publica y Finanzas',
'Licenciatura en Informatica Administrativa',
'Licenciatura en Economia',
'Licenciatura en Antropologia',
'Licenciatura en Periodismo',
'Licenciatura en Trabajo Social',
'Licenciatura en Historia',
'Licenciatura en Sociologia',
'Licenciatura en Letras',
'Licenciatura en Filosofia',
'Licenciatura en Educacion Fisica',
'Licenciatura en Lenguas Extranjeras con Orientacion en Ingles y Frances',
'Licenciatura en Musica',
'Licenciatura en Matematica',
'Licenciatura en Fisica',
'Licenciatura en Astronomia y Astrofisica',
'Licenciatura en Quimica y Farmacia',
'Licenciatura en Biologia',
'Licenciatura en Nutricion',
'Licenciatura en Fonoaudiologia',
'Licenciatura en Mercadotecnia',
'Licenciatura en Banca y Finanzas',
'Licenciatura en Ciencia y Tecnologias de la Informacion Geografica',
'Arquitectura',
'Ingenieria Agronomica',
'Ingenieria Forestal',
'Ingenieria Agroindustrial',
'Tecnico Universitario en Educacion Basica para la Ensenanza del Espanol',
'Tecnico Universitario en Metalurgia',
'Tecnico Universitario en Produccion Agricola',
'Tecnico Universitario en Terapia Funcional',
'Tecnico Universitario en Metalurgia',
'Tecnico Universitario en Produccion Agricola',
'Tecnico Universitario en Terapia Funcional',
'Tecnico Universitario en Educacion Basica para la Ensenanza del Espanol',
'Tecnico Interprete en Lenguaje de Senas',
'Tecnico Universitario en Administracion de Empresas Cafetaleras',
'Tecnico en Microfinanzas',
'Tecnico en Salud Familiar',
'Administracion de Empresas Agropecuarias',
'Tecnico en Microfinanzas',
'Tecnico en Administracion de Empresas Cafetaleras',
'Otro UNAH',
];


export const DIAGNOSTIC_OPTIONS = [
'Trastorno de ansiedad generalizada',
'Trastorno Depresivo mayor',
'Trastorno depresivo persistente',
'Depresion moderada',
'Trastorno de adaptacion',
'Trastorno por deficit de atencion e hiperactividad (TDAH)',
'Trastornos adictivos',
'Trastorno de control de impulsos',
'Trastorno de estres postraumatico (TEPT)',
'Trastorno de estres agudo',
'Trastorno de lecto-escritura',
'Trastorno de conducta',
'Trastorno del aprendizaje',
'Trastorno del desarrollo del lenguaje',
'Fobia social',
'Trastorno de panico',
'Fobia especifica',
'Ciclotimia',
'Trastorno explosivo intermitente',
'Trastorno de apego reactivo',
'Trastorno de duelo complicado',
'Anorexia nerviosa',
'Bulimia nerviosa',
'Despersonalizacion-desrealizacion',
'Otros',
];

export const TASK_OPTIONS = [
 'Registro de pensamiento disfuncionales',
 'Diario de emociones',
 'Registro semanal de actividades',
 'Registro de relajación',
 'Ejercicios de respiración',
 'Práctica de conducta',
 'Ensayos',
 'Registro de imaginería',
 'FODA',
 'Plan de vida',
 'Plan de autocuidado',
 'Kit de autocuidado',
 'Primeros auxilios psicológicos',
 'Evaluación vocacional',
 'Orientacion vocacional',
 'Consejería',
 'Neurofeedback',
 'Exposición gradual',
 'Establecimiento de rutinas estructuradas',
 'Lecturas breves',
 'Visualización guiada',
 'Registro de logros',
 'Other Task',
];

export const INTERVENTION_OPTIONS = [
  'Primeros auxilios psicológicos',
  'Terapia de crisis',
  'Consejería',
  'Terapia breve',
  'Evaluacion Vocacional',
  'Orientacion vocacional',
  'Neurofeedback',
  'Programa de funciones ejecutivas',
  'Other Intervention',
  'N/A',
];


export const FAMILYCORE_OPTIONS = [
'Familia Nuclear Tradicional',
'Familia Monoparental',
'Familia Extendida',
'Unión Libre (Familia de Hecho)',
'Familia Reconstituida (Ensamblada)',
'Familia Sin Parentesco Biológico',
'Hogares Unipersonales',
'Ninguno',
];

export const REMISSION_OPTIONS = [
'Parroquia Guadalupe',
'CS - Miguel Paz Barahona',
'CS - Las Palmas',
'Hospital Mario Catarino Rivas',
'Hospital San Juan de Dios',
'ISEE - Inst SAP Educación Social',
'Familia Sin Parentesco Biológico',
'Otro Destino',
];



export const APPOINTMENT_STATUSES = {
  SCHEDULED: 'Scheduled',
  CANCELED: 'Canceled',
  COMPLETED: 'Completed',
};

export const CONFIG_TYPES = {
  MAJOR: 'Major',
  PROGRAM: 'Program',
  DIAGNOSIS: 'Diagnosis',
};

// Removed hardcoded PROGRAMS constant.
