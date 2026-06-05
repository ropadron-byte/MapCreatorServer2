// ================================================================
//  GENERADOR DE CIUDADES · LÓGICA URBANA REALISTA
//  + SISTEMA DE CARPETA LOCAL CON SUBDIRECTORIOS
// ================================================================

let SIZE = 56;
const CELL = 32;

// ── TIPOS DE TERRENO ──────────────────────────────────────────────
const T = {
    EMPTY:    { emoji: "⬜", bg: "#c8b89a", name: "Terreno vacío" },
    AVENUE:   { emoji: "🛣️",  bg: "#e8c84a", name: "Avenida principal" },
    ROAD:     { emoji: "",     bg: "#7e9ab0", name: "Calle" },
    ALLEY:    { emoji: "▪️",  bg: "#b8a878", name: "Callejón" },
    SIDEWALK: { emoji: "🟫",  bg: "#c8a870", name: "Acera" },
    PLAZA:    { emoji: "⬜",  bg: "#e0d0b0", name: "Plaza pública" },
    GARDEN:   { emoji: "🌿",  bg: "#7cb518", name: "Jardín interior" },
    PARK:     { emoji: "🌳",  bg: "#5a9e10", name: "Parque" },
    FOUNTAIN: { emoji: "💧",  bg: "#6c9ebf", name: "Fuente" },
    WATER:    { emoji: "🌊",  bg: "#3b82f6", name: "Agua" },
    DOCK:     { emoji: "⚓",  bg: "#2a6099", name: "Muelle" },
    FENCE:    { emoji: "🪵",  bg: "#8b5a2b", name: "Valla de madera" }
};

// ── EDIFICIOS ──────────────────────────────────────────────────────
const BUILDINGS = {
    casa_min:    { emoji:"🏠", bg:"#8ab85a", name:"Casa modesta",      zone:"res", minW:1,maxW:2,minH:1,maxH:2, w:1, freq:1 },
    casa_med:    { emoji:"🏘️", bg:"#7aac48", name:"Casa mediana",       zone:"res", minW:2,maxW:3,minH:2,maxH:3, w:1, freq:1 },
    casa_gran:   { emoji:"🏡", bg:"#6a9e38", name:"Casa con jardín",    zone:"res", minW:2,maxW:3,minH:2,maxH:3, w:0.7,freq:1 },
    edificio:    { emoji:"🏢", bg:"#7890c0", name:"Edificio de aptos",  zone:"res", minW:2,maxW:4,minH:2,maxH:4, w:0.5,freq:1 },
    granja:      { emoji:"🚜", bg:"#e6c229", name:"Granja",             zone:"res", minW:5,maxW:6,minH:5,maxH:6, w:1, freq:1 }, 
    tienda:      { emoji:"🏪", bg:"#f4a261", name:"Tienda",             zone:"com", minW:1,maxW:2,minH:1,maxH:2, w:1, freq:1 },
    tienda_gran: { emoji:"🏬", bg:"#e0922e", name:"Tienda grande",      zone:"com", minW:2,maxW:3,minH:1,maxH:2, w:0.8,freq:1 },
    panaderia:   { emoji:"🥖", bg:"#e8b08a", name:"Panadería",          zone:"com", minW:1,maxW:2,minH:1,maxH:2, w:0.6,freq:1 },
    carniceria:  { emoji:"🍖", bg:"#d09080", name:"Carnicería",         zone:"com", minW:1,maxW:2,minH:1,maxH:2, w:0.5,freq:1 },
    farmacia:    { emoji:"💊", bg:"#b0d8fe", name:"Farmacia",           zone:"com", minW:1,maxW:2,minH:1,maxH:2, w:0.4,freq:1 },
    taberna:     { emoji:"🍺", bg:"#c8a040", name:"Taberna / Posada",   zone:"com", minW:2,maxW:3,minH:2,maxH:3, w:0.6,freq:1 },
    mercado:     { emoji:"🏟️", bg:"#e9b35f", name:"Mercado",            zone:"com", minW:3,maxW:5,minH:3,maxH:5, w:0.4,freq:1 },
    banco:       { emoji:"🏦", bg:"#d9f99d", name:"Banco",              zone:"com", minW:2,maxW:3,minH:2,maxH:3, w:0.4,freq:1 },
    c_comercial: { emoji:"🏬", bg:"#fde68a", name:"Centro comercial",   zone:"com", minW:3,maxW:4,minH:3,maxH:4, w:0.2,freq:1 }, 
    pescaderia:  { emoji:"🐟", bg:"#7ec8e0", name:"Pescadería",         zone:"com", minW:1,maxW:2,minH:1,maxH:2, w:0.5,freq:1 },
    templo:      { emoji:"⛪", bg:"#a7c957", name:"Templo",             zone:"civ", minW:3,maxW:5,minH:3,maxH:5, w:1, freq:1 },
    ayto:        { emoji:"🏛️", bg:"#cd9771", name:"Ayuntamiento",       zone:"civ", minW:3,maxW:5,minH:3,maxH:5, w:0.5,freq:1 },
    escuela:     { emoji:"🏫", bg:"#c7d2fe", name:"Escuela",            zone:"civ", minW:2,maxW:3,minH:2,maxH:3, w:0.5,freq:1 },
    hospital:    { emoji:"🏥", bg:"#fecaca", name:"Hospital",           zone:"civ", minW:3,maxW:5,minH:3,maxH:5, w:0.3,freq:1 },
    biblioteca:  { emoji:"📖", bg:"#c8a8d8", name:"Biblioteca",         zone:"civ", minW:2,maxW:4,minH:2,maxH:4, w:0.4,freq:1 },
    policia:     { emoji:"👮", bg:"#3a6ea5", name:"Comisaría",          zone:"civ", minW:2,maxW:3,minH:2,maxH:3, w:0.3,freq:1 },
    herreria:    { emoji:"⚒️", bg:"#bc6c25", name:"Herrería",           zone:"ind", minW:2,maxW:3,minH:2,maxH:3, w:1, freq:1 },
    almacen:     { emoji:"📦", bg:"#a09090", name:"Almacén",            zone:"ind", minW:3,maxW:5,minH:2,maxH:4, w:1, freq:1 },
    mina:        { emoji:"⛏️", bg:"#8a6040", name:"Entrada a mina",     zone:"ind", minW:2,maxW:3,minH:2,maxH:3, w:0.5,freq:1 },
    construccion:{ emoji:"🚧", bg:"#d97706", name:"En construcción",    zone:"any", minW:1,maxW:3,minH:1,maxH:3, w:0.3,freq:1 },
};

// ── CONFIGURACIÓN POR MODO ─────────────────────────────────────────
const MODES = {
    capital: {
        label: "🏛️ Capital",
        streetSpacing: { avenue:10, road:5 },
        waterChance: 0.3,
        buildingDensity: 0.85,
        zoneWeights: { res:40, com:30, civ:20, ind:10 },
        buildingWeights: {
            casa_min:15, casa_med:12, casa_gran:8, edificio:10, granja:0,
            tienda:8, tienda_gran:6, panaderia:4, carniceria:3, farmacia:3, taberna:0, 
            mercado:3, banco:4, c_comercial:3, pescaderia:1,
            templo:3, ayto:2, escuela:4, hospital:2, biblioteca:2, policia:2,
            herreria:2, almacen:2, mina:0, construccion:3,
        }
    },
    pueblo: {
        label: "🏡 Pueblo",
        streetSpacing: { avenue:0, road:9 },
        waterChance: 0,
        buildingDensity: 0.6,
        zoneWeights: { res:65, com:20, civ:10, ind:5 },
        buildingWeights: {
            casa_min:40, casa_med:20, casa_gran:15, edificio:0, granja:20,
            tienda:6, tienda_gran:2, panaderia:3, carniceria:3, farmacia:2, taberna:6,
            mercado:1, banco:0, c_comercial:0, pescaderia:0,
            templo:2, ayto:1, escuela:2, hospital:1, biblioteca:0, policia:0,
            herreria:3, almacen:2, mina:0, construccion:1,
        }
    },
    puerto: {
        label: "⚓ Puerto",
        streetSpacing: { avenue:8, road:5 },
        waterChance: 1, 
        buildingDensity: 0.8,
        zoneWeights: { res:35, com:35, civ:10, ind:20 },
        buildingWeights: {
            casa_min:18, casa_med:12, casa_gran:6, edificio:5, granja:0,
            tienda:8, tienda_gran:5, panaderia:3, carniceria:3, farmacia:2, taberna:0, 
            mercado:5, banco:3, c_comercial:1, pescaderia:8,
            templo:2, ayto:1, escuela:2, hospital:2, biblioteca:1, policia:2,
            herreria:5, almacen:14, mina:0, construccion:2,
        }
    },
    minera: {
        label: "⛏️ Minera",
        streetSpacing: { avenue:0, road:7 },
        waterChance: 0, 
        buildingDensity: 0.75,
        zoneWeights: { res:40, com:20, civ:10, ind:30 },
        buildingWeights: {
            casa_min:28, casa_med:14, casa_gran:8, edificio:2, granja:0,
            tienda:4, tienda_gran:1, panaderia:2, carniceria:2, farmacia:2, taberna:0, 
            mercado:1, banco:2, c_comercial:0, pescaderia:0,
            templo:1, ayto:1, escuela:2, hospital:2, biblioteca:1, policia:2,
            herreria:18, almacen:10, mina:8, construccion:3,
        }
    },
    comercial: {
        label: "🏬 Comercial",
        streetSpacing: { avenue:7, road:4 },
        waterChance: 0.2,
        buildingDensity: 0.9,
        zoneWeights: { res:25, com:50, civ:15, ind:10 },
        buildingWeights: {
            casa_min:10, casa_med:8, casa_gran:4, edificio:8, granja:0,
            tienda:18, tienda_gran:12, panaderia:5, carniceria:4, farmacia:4, taberna:0, 
            mercado:8, banco:7, c_comercial:5, pescaderia:1,
            templo:2, ayto:1, escuela:2, hospital:1, biblioteca:1, policia:1,
            herreria:2, almacen:3, mina:0, construccion:2,
        }
    }
};

// Normalizar pesos
for (let mode in MODES) {
    let bw = MODES[mode].buildingWeights;
    let total = Object.values(bw).reduce((a,b)=>a+b,0);
    if (total > 0) for (let k in bw) bw[k] = bw[k]/total*100;
}

// ── UTILIDADES ─────────────────────────────────────────────────────
function rnd(min, max) { return min + Math.floor(Math.random()*(max-min+1)); }
function rndFloat() { return Math.random(); }
function shuffle(arr) {
    for (let i=arr.length-1;i>0;i--) {
        const j=Math.floor(Math.random()*(i+1));
        [arr[i],arr[j]]=[arr[j],arr[i]];
    }
    return arr;
}
function dist(r1,c1,r2,c2) { return Math.abs(r1-r2)+Math.abs(c1-c2); }
function distEuclid(r1,c1,r2,c2) { return Math.hypot(r1-r2, c1-c2); }

// ── GENERADOR DE NOMBRES ✨ MEJORADO ─────────────────────────────
const NAMES = {
    streetAdjs: [
        "del Sol", "de la Luna", "del Rey", "de la Reina", "Mayor", "Nueva", "Vieja", "Alta", "Baja",
        "del Comercio", "del Puerto", "de las Flores", "del Río", "del Roble", "del Pino",
        "de los Artesanos", "del Mercado", "Imperial", "de la Plata", "del Oro", "de la Cruz",
        "Verde", "del Viento", "del Mar", "de la Herradura", "del Alba", "del Crepúsculo",
        "del Martillo", "de la Espada", "del Castillo", "de las Fuentes", "de las Sombras",
        "del Dragón", "del Fénix", "del Unicornio", "del Grifo", "del León", "del Águila",
        "del Lobo", "del Oso", "del Ciervo", "del Jabalí", "del Zorro", "de la Liebre",
        "del Trueno", "del Relámpago", "del Hielo", "del Fuego", "del Bosque", "del Valle",
        "de la Montaña", "de la Pradera", "de las Dunas", "del Océano", "de la Brisa",
        "de la Lluvia", "de la Nieve", "del Granizo", "de la Niebla", "del Rocío",
        "de la Cerveza", "del Vino", "del Queso", "del Pan", "de la Miel", "de las Especias",
        "de los Sueños", "de los Recuerdos", "de las Leyendas", "de los Héroes", "de los Poetas",
        "de los Sabios", "de los Locos", "de los Niños", "de los Ancianos", "de los Viajeros",
        "del Mapa", "del Pergamino", "del Tintero", "de la Pluma", "del Sello", "de la Campana",
        "del Reloj", "de la Rosa", "del Lirio", "de la Violeta", "del Clavel", "de la Amapola",
        "del Trigo", "de la Cebada", "del Olivo", "de la Vid", "del Manzano", "del Peral"
    ],
    surnames: [
        "García", "Martínez", "López", "Sánchez", "Pérez", "Gómez", "Martín", "Jiménez", "Ruiz",
        "Hernández", "Díaz", "Moreno", "Muñoz", "Álvarez", "Romero", "Alonso", "Gutiérrez",
        "Navarro", "Torres", "Domínguez", "Reyes", "Blanco", "Iglesias", "Vidal", "Molina",
        "del Castillo", "de la Vega", "Mendoza", "Cabrera", "Ortega", "Castro", "Serrano",
        "Pascual", "Santos", "Crespo", "Marín", "Cortés", "Guerrero", "Márquez", "Flores",
        "Benítez", "Aguilar", "Cano", "Esteban", "Ferrer", "Gil", "Herrero", "Lorenzo", "Mora"
    ],
    comNames: [
        "El Buen Gusto", "La Estrella", "El Faro", "La Corona", "El León", "La Perla", "El Ancla",
        "La Rosa", "El Sol", "El Cisne", "La Campana", "El Escudo", "La Herradura", "El Dragón",
        "El Cuervo", "La Luna", "El Barril", "El Caldero Mágico", "La Llave de Oro", "El Gato Negro",
        "La Cerveza Fría", "El Alquimista", "El Búho", "La Taberna Encantada", "El Puñal", "La Dama",
        "El Gólem", "El Unicornio", "La Rosa de los Vientos", "El Muelle", "El León Dormido",
        "La Torre Oscura", "El Palacio", "El Jardín Secreto", "El Bosque Encantado", "La Fuente de la Vida"
    ],
    civNames: [
        "San Juan", "San Miguel", "Santa María", "San Pedro", "San Pablo", "Santa Ana", "San Jorge",
        "San Lucas", "San Mateo", "San Marcos", "Santo Tomás", "Santa Clara", "Santa Bárbara",
        "San Sebastián", "Santa Lucía", "San Cristóbal", "San Antonio", "San Francisco", "Santo Domingo",
        "San José", "San Roque", "San Telmo", "Santa Inés", "Santa Cecilia", "San Gabriel", "San Rafael"
    ],
    farmAdjs: [
        "La Esperanza", "El Amanecer", "Los Robles", "El Valle", "Las Praderas", "Los Pinos",
        "El Molino", "La Colina", "Agua Clara", "Los Trigales", "La Arboleda", "El Soto",
        "La Vega", "Los Molinos", "El Cortijo", "La Fuente", "El Cercado", "La Huerta",
        "El Olivar", "La Viña", "El Nogal", "La Encina", "El Fresno", "La Alameda", "El Prado"
    ],
    districtPrefixes: [
        "Alta", "Baja", "Nueva", "Vieja", "Real", "Imperial", "del Oeste", "del Este", "del Norte",
        "del Sur", "Central", "Antigua", "Moderna", "Dorada", "Plateada", "Verde", "Azul", "Roja",
        "de los Artesanos", "de los Mercaderes", "de los Guerreros", "de los Sabios", "de los Clérigos",
        "de los Pescadores", "de los Granjeros", "de los Mineros", "de los Herreros", "de los Tejedores"
    ],
    tavernSuffixes: [
        "del Oso", "del Buey", "del Cuervo", "de la Dama", "del Gólem", "del Caldero", "de la Llave",
        "de la Espada", "del Martillo", "de la Rosa", "del León", "del Águila", "del Lobo", "del Ciervo",
        "del Jabalí", "del Zorro", "de la Liebre", "del Unicornio", "del Dragón", "del Fénix", "del Grifo"
    ]
};

function generateStreetName(type) {
    let suf;
    if (type === "Calle" && Math.random() < 0.3) {
        suf = NAMES.districtPrefixes[rnd(0, NAMES.districtPrefixes.length - 1)];
    } else {
        suf = NAMES.streetAdjs[rnd(0, NAMES.streetAdjs.length - 1)];
    }
    return `${type} ${suf}`;
}

function generateBuildingName(btype) {
    const zone = btype.zone;
    if (btype.name === "Granja") {
        const n = NAMES.farmAdjs[rnd(0, NAMES.farmAdjs.length - 1)];
        return `Granja "${n}"`;
    }
    if (zone === 'res') {
        const ln = NAMES.surnames[rnd(0, NAMES.surnames.length - 1)];
        if (btype.name.includes("Edificio")) return `Edificio ${ln}`;
        if (Math.random() < 0.5) return `${btype.name} de los ${ln}`;
        else return `${btype.name} ${ln}`;
    } 
    if (zone === 'com') {
        if (btype.name.includes("Taberna") || btype.name.includes("Posada")) {
            let n;
            if (Math.random() < 0.6) {
                n = NAMES.comNames[rnd(0, NAMES.comNames.length - 1)];
            } else {
                n = NAMES.tavernSuffixes[rnd(0, NAMES.tavernSuffixes.length - 1)];
                n = `La Taberna ${n}`;
            }
            return `${btype.name.split(" / ")[0]} "${n}"`;
        }
        if (btype.name.includes("Mercado") || btype.name.includes("Centro")) {
            const saint = NAMES.civNames[rnd(0, NAMES.civNames.length - 1)];
            return `${btype.name} de ${saint}`;
        }
        const ln = NAMES.surnames[rnd(0, NAMES.surnames.length - 1)];
        return `${btype.name} ${ln}`;
    } 
    if (zone === 'civ') {
        if (btype.name === "Templo" || btype.name === "Hospital" || btype.name === "Escuela") {
            const saint = NAMES.civNames[rnd(0, NAMES.civNames.length - 1)];
            return `${btype.name} de ${saint}`;
        }
        if (btype.name === "Ayuntamiento") {
            const prefix = NAMES.districtPrefixes[rnd(0, NAMES.districtPrefixes.length - 1)];
            return `${btype.name} ${prefix}`;
        }
        return `${btype.name} Central`;
    }
    if (zone === 'ind') {
        if (btype.name === "Mina" || btype.name === "Entrada a mina") {
            const n = NAMES.comNames[rnd(0, NAMES.comNames.length - 1)];
            return `Mina "${n}"`;
        }
        const ln = NAMES.surnames[rnd(0, NAMES.surnames.length - 1)];
        return `${btype.name} ${ln}`;
    }
    return btype.name;
}

// ── GRID ────────────────────────────────────────────────────────────
function makeGrid() {
    return Array.from({length:SIZE}, ()=>Array.from({length:SIZE}, ()=>({
        type: T.EMPTY,
        building: null,    
        buildingId: null,
        isEntrance: false,
        isMainIcon: false, 
        zone: null,        
        info: null,
    })));
}

// ── 1. RED VIAL JERÁRQUICA ──────────────────────────────────────
function buildRoads(grid, mode) {
    const cfg = MODES[mode].streetSpacing;
    const mid = Math.floor(SIZE/2);

    let avenueRows = new Set();
    let avenueCols = new Set();

    if (cfg.avenue > 0) {
        avenueRows.add(mid);
        avenueCols.add(mid);
        
        let curr = mid - (cfg.avenue + rnd(0, 4));
        while (curr >= 0) { if (Math.random() > 0.2) avenueRows.add(curr); curr -= (cfg.avenue + rnd(0, 4)); }
        
        curr = mid + (cfg.avenue + rnd(0, 4));
        while (curr < SIZE) { if (Math.random() > 0.2) avenueRows.add(curr); curr += (cfg.avenue + rnd(0, 4)); }

        curr = mid - (cfg.avenue + rnd(0, 4));
        while (curr >= 0) { if (Math.random() > 0.2) avenueCols.add(curr); curr -= (cfg.avenue + rnd(0, 4)); }
        
        curr = mid + (cfg.avenue + rnd(0, 4));
        while (curr < SIZE) { if (Math.random() > 0.2) avenueCols.add(curr); curr += (cfg.avenue + rnd(0, 4)); }
    }

    let sortedAR = [...avenueRows].sort((a,b)=>a-b);
    let sortedAC = [...avenueCols].sort((a,b)=>a-b);

    let roadRows = new Set();
    let roadCols = new Set();

    function fillBetween(set, from, to, baseSpacing) {
        let current = from + baseSpacing + rnd(-1, 2);
        while (current < to) {
            set.add(current);
            current += baseSpacing + rnd(-1, 2);
        }
    }

    if (sortedAR.length === 0) {
        fillBetween(roadRows, 0, SIZE, cfg.road);
        fillBetween(roadCols, 0, SIZE, cfg.road);
    } else {
        fillBetween(roadRows, 0, sortedAR[0], cfg.road);
        fillBetween(roadCols, 0, sortedAC[0], cfg.road);
        for (let k=0;k<sortedAR.length-1;k++) fillBetween(roadRows, sortedAR[k], sortedAR[k+1], cfg.road);
        for (let k=0;k<sortedAC.length-1;k++) fillBetween(roadCols, sortedAC[k], sortedAC[k+1], cfg.road);
        fillBetween(roadRows, sortedAR[sortedAR.length-1], SIZE, cfg.road);
        fillBetween(roadCols, sortedAC[sortedAC.length-1], SIZE, cfg.road);
    }

    for (let r of avenueRows) roadRows.delete(r);
    for (let c of avenueCols) roadCols.delete(c);

    for (let r of sortedAR) {
        let start = 0;
        let end = SIZE - 1;
        if (r !== mid && sortedAC.length >= 3 && Math.random() > 0.4) {
            let idx1 = Math.floor(Math.random() * (sortedAC.length - 1));
            let idx2 = Math.floor(Math.random() * (sortedAC.length - idx1 - 1)) + idx1 + 1;
            start = sortedAC[idx1];
            end = sortedAC[idx2];
        }
        const streetName = generateStreetName("Avenida");
        for (let c = start; c <= end; c++) {
            if (c>=0 && c<SIZE && (grid[r][c].type===T.EMPTY || grid[r][c].type===T.ROAD)) {
                grid[r][c].type = T.AVENUE;
                grid[r][c].info = streetName;
            }
        }
    }

    for (let c of sortedAC) {
        let start = 0;
        let end = SIZE - 1;
        if (c !== mid && sortedAR.length >= 3 && Math.random() > 0.4) {
            let idx1 = Math.floor(Math.random() * (sortedAR.length - 1));
            let idx2 = Math.floor(Math.random() * (sortedAR.length - idx1 - 1)) + idx1 + 1;
            start = sortedAR[idx1];
            end = sortedAR[idx2];
        }
        const streetName = generateStreetName("Avenida");
        for (let r = start; r <= end; r++) {
            if (r>=0 && r<SIZE && (grid[r][c].type===T.EMPTY || grid[r][c].type===T.ROAD)) {
                grid[r][c].type = T.AVENUE;
                grid[r][c].info = streetName;
            }
        }
    }

    for (let r of roadRows) {
        const streetName = generateStreetName("Calle");
        for (let c=0;c<SIZE;c++) {
            if (grid[r][c].type===T.EMPTY) {
                grid[r][c].type = T.ROAD;
                grid[r][c].info = streetName;
            }
        }
    }
    for (let c of roadCols) {
        const streetName = generateStreetName("Calle");
        for (let r=0;r<SIZE;r++) {
            if (grid[r][c].type===T.EMPTY) {
                grid[r][c].type = T.ROAD;
                grid[r][c].info = streetName;
            }
        }
    }

    return { avenueRows, avenueCols, roadRows, roadCols };
}

// ── 2. ACERAS ────────────────────────────────────────────────────────
function buildSidewalks(grid) {
    const dirs = [[-1,0],[1,0],[0,-1],[0,1]];
    let candidates = new Set();
    for (let r=0;r<SIZE;r++) {
        for (let c=0;c<SIZE;c++) {
            const t = grid[r][c].type;
            if (t===T.AVENUE||t===T.ROAD) {
                for (let [dr,dc] of dirs) {
                    let nr=r+dr, nc=c+dc;
                    if (nr>=0&&nr<SIZE&&nc>=0&&nc<SIZE) {
                        const nt = grid[nr][nc].type;
                        if (nt===T.EMPTY) candidates.add(`${nr},${nc}`);
                    }
                }
            }
        }
    }
    for (let key of candidates) {
        let [r,c] = key.split(',').map(Number);
        if (grid[r][c].type===T.EMPTY) grid[r][c].type = T.SIDEWALK;
    }
}

// ── 3. AGUA ──────────────────────────────────────────────────────────
function addWater(grid, mode) {
    const cfg = MODES[mode];
    if (cfg.waterChance === 0) return;
    if (mode === 'minera') {
        const cx = rnd(SIZE*0.3, SIZE*0.7), cy = rnd(SIZE*0.3, SIZE*0.7);
        const rx = rnd(Math.floor(SIZE*0.05), Math.floor(SIZE*0.1)), 
              ry = rnd(Math.floor(SIZE*0.05), Math.floor(SIZE*0.12));
        for (let r=0;r<SIZE;r++) for (let c=0;c<SIZE;c++) {
            if (((r-cx)/rx)**2+((c-cy)/ry)**2 < 1) {
                grid[r][c].type = T.WATER;
                grid[r][c].building = null;
            }
        }
        return;
    }
    if (mode === 'puerto' || rndFloat()<cfg.waterChance) {
        const side = Math.floor(rndFloat()*4);
        const depth = rnd(Math.floor(SIZE*0.1), Math.floor(SIZE*0.2));
        for (let r=0;r<SIZE;r++) for (let c=0;c<SIZE;c++) {
            let d;
            if (side===0) d = r;
            else if (side===1) d = SIZE-1-r;
            else if (side===2) d = c;
            else d = SIZE-1-c;
            const pos = (side<2)?c:r;
            const variation = Math.sin(pos*0.4)*2 + Math.sin(pos*0.7)*1.5;
            if (d < depth + variation) {
                grid[r][c].type = T.WATER;
                grid[r][c].building = null;
            }
        }
        for (let r=0;r<SIZE;r++) for (let c=0;c<SIZE;c++) {
            if (grid[r][c].type===T.WATER) {
                for (let [dr,dc] of [[-1,0],[1,0],[0,-1],[0,1]]) {
                    let nr=r+dr,nc=c+dc;
                    if (nr>=0&&nr<SIZE&&nc>=0&&nc<SIZE&&
                        (grid[nr][nc].type===T.ROAD||grid[nr][nc].type===T.AVENUE||grid[nr][nc].type===T.SIDEWALK)) {
                        grid[nr][nc].type = T.DOCK;
                    }
                }
            }
        }
    }
}

// ── 4. ZONIFICACIÓN ─────────────────────────────────────────────────
function assignZones(grid, mode) {
    const cx = SIZE/2, cy = SIZE/2;
    const maxR = SIZE/2;
    const zw = MODES[mode].zoneWeights;

    const total = zw.res+zw.com+zw.civ+zw.ind;
    const rCiv = maxR * (zw.civ/total) * 2.5;
    const rCom = rCiv + maxR * (zw.com/total) * 2.0;
    const rRes = rCom + maxR * (zw.res/total) * 1.5;

    for (let r=0;r<SIZE;r++) for (let c=0;c<SIZE;c++) {
        if (grid[r][c].type!==T.EMPTY&&grid[r][c].type!==T.SIDEWALK) continue;
        const d = distEuclid(r,c,cx,cy);
        const noise = (Math.sin(r*0.5)*Math.cos(c*0.7)*3);
        const dn = d+noise;
        if (dn < rCiv) grid[r][c].zone = 'civ';
        else if (dn < rCom) grid[r][c].zone = 'com';
        else if (dn < rRes) grid[r][c].zone = 'res';
        else grid[r][c].zone = 'ind';
    }
}

// ── 5. MANZANAS ─────────────────────────────────────────────────────
function getManzanas(roadRows, avenueCols, roadCols, avenueRows) {
    const allR = new Set([...roadRows,...avenueRows]);
    const allC = new Set([...roadCols,...avenueCols]);

    function intervals(set, limit) {
        let sorted = [...set,-1,limit].sort((a,b)=>a-b);
        let ivs = [];
        for (let k=0;k<sorted.length-1;k++) {
            let s=sorted[k]+1, e=sorted[k+1]-1;
            if (e>=s) ivs.push({start:s,end:e});
        }
        return ivs;
    }
    const rowIvs = intervals(allR, SIZE);
    const colIvs = intervals(allC, SIZE);

    let manzanas = [];
    for (let ri of rowIvs) for (let ci of colIvs) {
        const h=ri.end-ri.start+1, w=ci.end-ci.start+1;
        if (h>=2&&w>=2) manzanas.push({ri,ci});
    }
    return manzanas;
}

// ── 6. PLAZA CENTRAL (con prefijos mejorados) ──────────────────────
function buildPlazas(grid, manzanas) {
    const cx=SIZE/2, cy=SIZE/2;
    if (manzanas.length===0) return;

    let bestManzana = null, bestDist=Infinity;
    for (let m of manzanas) {
        const mr=(m.ri.start+m.ri.end)/2, mc=(m.ci.start+m.ci.end)/2;
        const d = distEuclid(mr,mc,cx,cy);
        if (d<bestDist) { bestDist=d; bestManzana=m; }
    }
    if (!bestManzana) return;

    const {ri,ci} = bestManzana;
    let saint = NAMES.civNames[rnd(0, NAMES.civNames.length - 1)];
    let prefix = "";
    if (Math.random() < 0.4) {
        prefix = NAMES.districtPrefixes[rnd(0, NAMES.districtPrefixes.length - 1)] + " ";
    }
    const plazaName = `Plaza ${prefix}de ${saint}`;

    for (let r=ri.start;r<=ri.end;r++) for (let c=ci.start;c<=ci.end;c++) {
        grid[r][c].type = T.PLAZA;
        grid[r][c].info = plazaName;
    }
    const fr=Math.round((ri.start+ri.end)/2), fc=Math.round((ci.start+ci.end)/2);
    grid[fr][fc].type = T.FOUNTAIN;
    grid[fr][fc].info = `Fuente de la ${plazaName}`;

    bestManzana.used = true;
}

// ── 7. SELECCIÓN DE TIPO DE EDIFICIO ────────────────────────────────
function selectBuildingType(mode, preferredZone, blockH, blockW, neighbors) {
    const bw = MODES[mode].buildingWeights;

    let candidates = [];
    for (let [id, bld] of Object.entries(BUILDINGS)) {
        let p = bw[id] || 0;
        if (p <= 0) continue;
        let zoneMult = 1.0;
        if (bld.zone !== 'any') {
            if (bld.zone === preferredZone) zoneMult = 2.5;
            else if (preferredZone === 'civ' && bld.zone === 'com') zoneMult = 0.5;
            else if (preferredZone === 'ind' && bld.zone === 'res') zoneMult = 0.4;
            else zoneMult = 0.3;
        }
        if (bld.minW > blockW || bld.minH > blockH) continue;

        candidates.push({ id, bld, score: p * zoneMult });
    }

    if (candidates.length === 0) return Object.values(BUILDINGS)[0];

    let total = candidates.reduce((s,c)=>s+c.score,0);
    let rand = rndFloat()*total;
    let acum = 0;
    for (let c of candidates) {
        acum += c.score;
        if (rand <= acum) return c.bld;
    }
    return candidates[candidates.length-1].bld;
}

// ── 8. LLENAR MANZANA CON EDIFICIOS ──────────────────────────────────
function fillManzana(grid, manzana, mode, buildingCounter) {
    const { ri, ci } = manzana;
    const blockH = ri.end-ri.start+1;
    const blockW = ci.end-ci.start+1;

    let zoneCounts = {res:0,com:0,civ:0,ind:0};
    for (let r=ri.start;r<=ri.end;r++) for (let c=ci.start;c<=ci.end;c++) {
        const z = grid[r][c].zone;
        if (z) zoneCounts[z]++;
    }
    const zone = Object.entries(zoneCounts).sort((a,b)=>b[1]-a[1])[0][0];

    let placed = [];
    let occupied = new Set(); 

    function canPlace(sr, sc, h, w) {
        if (sr<ri.start||sr+h-1>ri.end||sc<ci.start||sc+w-1>ci.end) return false;
        for (let r=sr;r<sr+h;r++) for (let c=sc;c<sc+w;c++) {
            const t = grid[r][c].type;
            if (t!==T.EMPTY&&t!==T.SIDEWALK&&t!==T.GARDEN) return false;
            if (occupied.has(`${r},${c}`)) return false;
        }
        return true;
    }

    function placeBuilding(sr, sc, h, w, btype) {
        const id = `b_${buildingCounter[0]++}`;
        const areaM = w*5 + 'm × ' + h*5 + 'm';
        const bName = generateBuildingName(btype); 
        
        const centerR = Math.floor(sr + h / 2);
        const centerC = Math.floor(sc + w / 2);
        
        if (btype.name === "Granja") {
            for (let r=sr; r<sr+h; r++) {
                for (let c=sc; c<sc+w; c++) {
                    const isEdge = (r===sr || r===sr+h-1 || c===sc || c===sc+w-1);
                    occupied.add(`${r},${c}`);
                    
                    if (isEdge) {
                        grid[r][c].type = T.FENCE;
                        grid[r][c].info = `Valla de ${bName}`;
                        grid[r][c].isEntrance = false;
                        grid[r][c].isMainIcon = false;
                    } else {
                        if (r >= sr+1 && r <= sr+2 && c >= sc+1 && c <= sc+2) {
                            grid[r][c].type = btype;
                            grid[r][c].building = btype;
                            grid[r][c].buildingId = id;
                            grid[r][c].info = `${bName} (${areaM})`;
                            grid[r][c].isEntrance = false;
                            grid[r][c].isMainIcon = (r === sr+1 && c === sc+1);
                        } else {
                            grid[r][c].type = T.GARDEN;
                            grid[r][c].info = "Patio de cultivos";
                            grid[r][c].isMainIcon = false;
                        }
                    }
                }
            }
            
            let entranceCandidates = [];
            for (let r=sr; r<sr+h; r++) {
                for (let c=sc; c<sc+w; c++) {
                    if (grid[r][c].type === T.FENCE) {
                        for (let [dr,dc] of [[-1,0],[1,0],[0,-1],[0,1]]) {
                            const nr=r+dr,nc=c+dc;
                            if (nr>=0&&nr<SIZE&&nc>=0&&nc<SIZE) {
                                const nt=grid[nr][nc].type;
                                if (nt===T.SIDEWALK||nt===T.ROAD||nt===T.AVENUE) {
                                    entranceCandidates.push([r,c]);
                                    break;
                                }
                            }
                        }
                    }
                }
            }
            if (entranceCandidates.length > 0) {
                shuffle(entranceCandidates);
                let [er,ec] = entranceCandidates[0];
                grid[er][ec].isEntrance = true;
                grid[er][ec].info = `Puerta de ${bName}`;
            }
            
            placed.push({ btype, sr, sc, h, w });
            return; 
        }

        // --- LÓGICA NORMAL PARA EL RESTO DE EDIFICIOS ---
        for (let r=sr;r<sr+h;r++) for (let c=sc;c<sc+w;c++) {
            grid[r][c].type = btype;
            grid[r][c].building = btype;
            grid[r][c].buildingId = id;
            grid[r][c].info = `${bName} (${areaM})`;
            grid[r][c].isEntrance = false;
            grid[r][c].isMainIcon = (r === centerR && c === centerC); 
            occupied.add(`${r},${c}`);
        }
        
        if (w > 1 || h > 1) {
            let entranceCandidates = [];
            for (let r=sr;r<sr+h;r++) {
                for (let c=sc;c<sc+w;c++) {
                    const isEdge=(r===sr||r===sr+h-1||c===sc||c===sc+w-1);
                    if (!isEdge) continue;
                    for (let [dr,dc] of [[-1,0],[1,0],[0,-1],[0,1]]) {
                        const nr=r+dr,nc=c+dc;
                        if (nr>=0&&nr<SIZE&&nc>=0&&nc<SIZE) {
                            const nt=grid[nr][nc].type;
                            if (nt===T.SIDEWALK||nt===T.ROAD||nt===T.AVENUE||nt===T.DOCK||nt===T.PLAZA) {
                                entranceCandidates.push([r,c]);
                                break;
                            }
                        }
                    }
                }
            }
            shuffle(entranceCandidates);
            let numEntrances = (w*h >= 6) ? 2 : 1;
            let entrances = [];
            for (let [er,ec] of entranceCandidates) {
                if (entrances.length >= numEntrances) break;
                const adjacent = entrances.some(([ar,ac])=>dist(ar,ac,er,ec)<=1);
                if (!adjacent) entrances.push([er,ec]);
            }
            for (let [er,ec] of entrances) {
                grid[er][ec].isEntrance = true;
                grid[er][ec].info = `🚪 Entrada a ${bName}`;
            }
        }
        
        placed.push({ btype, sr, sc, h, w });
    }

    const density = MODES[mode].buildingDensity;
    let attempts = 0;
    const maxAttempts = 40;

    if (zone === 'civ' && blockH>=4 && blockW>=4 && rndFloat()<0.7) {
        const btype = selectBuildingType(mode, 'civ', blockH, blockW, []);
        const bh = rnd(btype.minH, Math.min(btype.maxH, blockH));
        const bw = rnd(btype.minW, Math.min(btype.maxW, blockW));
        const offsetR = Math.floor((blockH-bh)/2);
        const offsetC = Math.floor((blockW-bw)/2);
        placeBuilding(ri.start+offsetR, ci.start+offsetC, bh, bw, btype);
        for (let r=ri.start;r<=ri.end;r++) for (let c=ci.start;c<=ci.end;c++) {
            if (!occupied.has(`${r},${c}`)&&grid[r][c].type===T.EMPTY) {
                grid[r][c].type = T.GARDEN;
                grid[r][c].info = "Jardín Municipal";
            }
        }
        return;
    }

    while (attempts < maxAttempts) {
        attempts++;
        let startR = -1, startC = -1;
        outer:
        for (let r=ri.start;r<=ri.end;r++) {
            for (let c=ci.start;c<=ci.end;c++) {
                if (!occupied.has(`${r},${c}`) && (grid[r][c].type===T.EMPTY||grid[r][c].type===T.SIDEWALK)) {
                    startR=r; startC=c; break outer;
                }
            }
        }
        if (startR===-1) break; 

        const availH = ri.end-startR+1;
        const availW = ci.end-startC+1;

        const btype = selectBuildingType(mode, zone, availH, availW, placed);
        const bh = rnd(btype.minH, Math.min(btype.maxH, availH));
        const bw = rnd(btype.minW, Math.min(btype.maxW, availW));

        if (canPlace(startR, startC, bh, bw)) {
            if (rndFloat() < density) {
                placeBuilding(startR, startC, bh, bw, btype);
            } else {
                for (let r=startR;r<startR+bh;r++) for (let c=startC;c<startC+bw;c++) {
                    occupied.add(`${r},${c}`);
                    if (grid[r][c].type===T.EMPTY) {
                        grid[r][c].type = T.GARDEN;
                        grid[r][c].info = "Patio / jardín";
                    }
                }
            }
        } else {
            occupied.add(`${startR},${startC}`);
        }
    }

    for (let r=ri.start;r<=ri.end;r++) for (let c=ci.start;c<=ci.end;c++) {
        if (grid[r][c].type===T.EMPTY) {
            grid[r][c].type = T.GARDEN;
            grid[r][c].info = "Patio";
        }
    }
}

// ── 9. PARQUES DE BARRIO (con nombres más variados) ─────────────────
function addNeighborhoodParks(grid, manzanas, mode) {
    const resManzanas = manzanas.filter(m => {
        if (m.used) return false;
        const mr=(m.ri.start+m.ri.end)/2, mc=(m.ci.start+m.ci.end)/2;
        return grid[Math.round(mr)][Math.round(mc)].zone === 'res';
    });
    shuffle(resManzanas);
    const numParks = Math.max(1, Math.floor(resManzanas.length*0.07));
    for (let i=0;i<numParks&&i<resManzanas.length;i++) {
        const m = resManzanas[i];
        m.used = true;
        
        let name;
        if (Math.random() < 0.6) {
            const ln = NAMES.surnames[rnd(0, NAMES.surnames.length - 1)];
            name = `Parque ${ln}`;
        } else {
            const prefix = NAMES.districtPrefixes[rnd(0, NAMES.districtPrefixes.length - 1)];
            name = `Parque ${prefix}`;
        }
        
        for (let r=m.ri.start;r<=m.ri.end;r++) for (let c=m.ci.start;c<=m.ci.end;c++) {
            grid[r][c].type = T.PARK;
            grid[r][c].info = name;
            grid[r][c].building = null;
        }
        const fr=Math.round((m.ri.start+m.ri.end)/2);
        const fc=Math.round((m.ci.start+m.ci.end)/2);
        if(fr>=0 && fr<SIZE && fc>=0 && fc<SIZE) {
            grid[fr][fc].type = T.FOUNTAIN;
            grid[fr][fc].info = `Fuente del ${name}`;
        }
    }
}

// ── 10. CONECTIVIDAD VIAL ──────────────────────────────────────────
function ensureConnectivity(grid) {
    let roadCells = [];
    for (let r=0;r<SIZE;r++) for (let c=0;c<SIZE;c++) {
        const t=grid[r][c].type;
        if (t===T.ROAD||t===T.AVENUE) roadCells.push([r,c]);
    }
    if (roadCells.length===0) return;

    const visited = new Set();
    const queue = [roadCells[0]];
    visited.add(`${roadCells[0][0]},${roadCells[0][1]}`);
    while (queue.length) {
        const [r,c] = queue.shift();
        for (let [dr,dc] of [[-1,0],[1,0],[0,-1],[0,1]]) {
            const nr=r+dr,nc=c+dc;
            if (nr<0||nr>=SIZE||nc<0||nc>=SIZE) continue;
            const key=`${nr},${nc}`;
            if (!visited.has(key)&&(grid[nr][nc].type===T.ROAD||grid[nr][nc].type===T.AVENUE)) {
                visited.add(key);
                queue.push([nr,nc]);
            }
        }
    }
    for (let [r,c] of roadCells) {
        if (!visited.has(`${r},${c}`)) {
            let bestDist=Infinity, bestCell=null;
            for (let [sr,sc] of roadCells) {
                if (visited.has(`${sr},${sc}`)) {
                    const d=dist(r,c,sr,sc);
                    if (d<bestDist) { bestDist=d; bestCell=[sr,sc]; }
                }
            }
            if (bestCell) {
                let [tr,tc]=bestCell, cr=r, cc=c;
                while (cr!==tr||cc!==tc) {
                    if (cr!==tr) cr+=(tr>cr?1:-1);
                    else cc+=(tc>cc?1:-1);
                    if (grid[cr][cc].type!==T.WATER) {
                        if (grid[cr][cc].type!==T.ROAD&&grid[cr][cc].type!==T.AVENUE) {
                            grid[cr][cc].type=T.ROAD;
                            grid[cr][cc].info = "Callejón de Conexión"; 
                        }
                        visited.add(`${cr},${cc}`);
                    } else break;
                }
            }
        }
    }
}

// ── GENERADOR PRINCIPAL ──────────────────────────────────────────────
function generateCity(mode) {
    const grid = makeGrid();

    const { avenueRows, avenueCols, roadRows, roadCols } = buildRoads(grid, mode);
    addWater(grid, mode);
    buildSidewalks(grid);
    assignZones(grid, mode);

    const manzanas = getManzanas(roadRows, avenueCols, roadCols, avenueRows);
    buildPlazas(grid, manzanas);
    addNeighborhoodParks(grid, manzanas, mode);

    const buildingCounter = [1];
    const toFill = shuffle(manzanas.filter(m=>!m.used));
    for (let m of toFill) fillManzana(grid, m, mode, buildingCounter);

    ensureConnectivity(grid);

    return grid;
}

// ── RENDERIZADO ──────────────────────────────────────────────────────
let currentGrid = null;
let currentMode = "capital";

function getCellBg(cell) {
    if (cell.building && !cell.isEntrance) return cell.building.bg;
    return cell.type.bg;
}

function getCellEmoji(cell) {
    if (cell.isEntrance) return "🚪";
    if (cell.building) return cell.isMainIcon ? cell.building.emoji : "";
    return cell.type.emoji;
}

function getCellTooltip(cell) {
    if (cell.info) return cell.info;
    return cell.type.name;
}

function render() {
    const container = document.getElementById("cityGrid");
    container.innerHTML = "";
    container.style.gridTemplateColumns = `repeat(${SIZE}, ${CELL}px)`;
    container.style.gridTemplateRows    = `repeat(${SIZE}, ${CELL}px)`;

    for (let r=0;r<SIZE;r++) for (let c=0;c<SIZE;c++) {
        const cell = currentGrid[r][c];
        const div = document.createElement("div");
        div.className = "cell";
        div.style.backgroundColor = getCellBg(cell);
        div.textContent = getCellEmoji(cell);
        div.title = getCellTooltip(cell);
        container.appendChild(div);
    }
}

function renderLegend() {
    const lg = document.getElementById("legend");
    lg.innerHTML = "";

    const terrainItems = [
        T.AVENUE, T.ROAD, T.SIDEWALK, T.PLAZA, T.PARK,
        T.GARDEN, T.FOUNTAIN, T.WATER, T.DOCK, T.FENCE 
    ];
    function addItem(emoji, bg, name) {
        const d = document.createElement("div");
        d.className = "legend-item";
        d.innerHTML = `<div class="legend-color" style="background:${bg};">${emoji}</div><span>${name}</span>`;
        lg.appendChild(d);
    }

    for (let t of terrainItems) addItem(t.emoji, t.bg, t.name);

    const bw = MODES[currentMode].buildingWeights;
    for (let [id, bld] of Object.entries(BUILDINGS)) {
        if ((bw[id]||0) <= 0) continue;
        addItem(bld.emoji, bld.bg, bld.name);
    }
}

// ── EXPORTAR E IMPORTAR MAPA (versión tradicional) ──────────────────
function exportMapTraditional() {
    if (!currentGrid) return;
    
    const serializedGrid = currentGrid.map(row => row.map(cell => {
        const typeKey = Object.keys(T).find(key => T[key] === cell.type) || "EMPTY";
        const bldKey = cell.building ? Object.keys(BUILDINGS).find(key => BUILDINGS[key] === cell.building) : null;
        
        return {
            t: typeKey,
            b: bldKey,
            id: cell.buildingId,
            e: cell.isEntrance,
            m: cell.isMainIcon,
            z: cell.zone,
            i: cell.info
        };
    }));

    const data = {
        mode: currentMode,
        grid: serializedGrid
    };

    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(data));
    const downloadNode = document.createElement('a');
    downloadNode.setAttribute("href", dataStr);
    downloadNode.setAttribute("download", `ciudad_${currentMode}_${new Date().getTime()}.json`);
    document.body.appendChild(downloadNode);
    downloadNode.click();
    downloadNode.remove();
}

function importMap(event) {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = function(e) {
        try {
            const data = JSON.parse(e.target.result);
            if (data && data.grid && data.mode) {
                currentMode = data.mode;
                document.getElementById("modeSelect").value = currentMode;
                
                SIZE = data.grid.length;
                const sizeSel = document.getElementById("sizeSelect");
                if (sizeSel) {
                    const validOption = [...sizeSel.options].some(o => parseInt(o.value) === SIZE);
                    if (validOption) sizeSel.value = SIZE;
                }

                currentGrid = data.grid.map(row => row.map(cell => ({
                    type: T[cell.t] || T.EMPTY,
                    building: cell.b ? BUILDINGS[cell.b] : null,
                    buildingId: cell.id,
                    isEntrance: cell.e,
                    isMainIcon: cell.m,
                    zone: cell.z,
                    info: cell.i
                })));
                
                render();
                renderLegend();
            } else {
                alert("El archivo no tiene el formato correcto de mapa.");
            }
        } catch (err) {
            alert("Error al leer el archivo JSON. Verifica que sea un mapa válido.");
        }
    };
    reader.readAsText(file);
    event.target.value = '';
}

function regenerate() {
    currentMode = document.getElementById("modeSelect").value;
    const sizeSel = document.getElementById("sizeSelect");
    if (sizeSel) {
        SIZE = parseInt(sizeSel.value);
    }
    currentGrid = generateCity(currentMode);
    render();
    renderLegend();
}

// ============================================================
// SISTEMA DE CARPETA LOCAL CON SUBDIRECTORIOS
// ============================================================
let currentRootHandle = null;
let ciudadesHandle = null;

async function ensureSubdirectories(root) {
    try {
        ciudadesHandle = await root.getDirectoryHandle("ciudades", { create: true });
        // También podríamos crear logs y personajes, pero en el generador solo necesitamos ciudades.
        return true;
    } catch (err) {
        console.error("Error creando subdirectorios:", err);
        return false;
    }
}

async function selectDirectory() {
    if (!window.showDirectoryPicker) {
        alert("Tu navegador no soporta selección de carpetas. Usa los botones tradicionales.");
        return;
    }
    try {
        const root = await window.showDirectoryPicker();
        currentRootHandle = root;
        if (await ensureSubdirectories(root)) {
            localStorage.setItem("cityRootName", root.name);
            document.getElementById("folderStatus").innerText = `📁 Carpeta: ${root.name}`;
            await listCityFiles();
        } else {
            alert("No se pudieron crear las subcarpetas necesarias.");
        }
    } catch (err) {
        console.error(err);
    }
}

async function listCityFiles() {
    if (!ciudadesHandle) return;
    const files = [];
    for await (const entry of ciudadesHandle.values()) {
        if (entry.kind === "file" && entry.name.endsWith(".json")) {
            files.push(entry.name);
        }
    }
    const select = document.getElementById("citySelect");
    select.innerHTML = '<option value="">-- Selecciona una ciudad --</option>';
    files.sort().forEach(f => {
        const opt = document.createElement("option");
        opt.value = f;
        opt.textContent = f;
        select.appendChild(opt);
    });
    if (files.length === 0) {
        select.innerHTML = '<option value="">No hay ciudades guardadas</option>';
    }
}

async function saveCityToFolder(cityData, suggestedName) {
    if (!ciudadesHandle) {
        // Fallback a descarga tradicional
        const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(cityData));
        const a = document.createElement("a");
        a.href = dataStr;
        a.download = suggestedName;
        a.click();
        return;
    }
    try {
        const fileHandle = await ciudadesHandle.getFileHandle(suggestedName, { create: true });
        const writable = await fileHandle.createWritable();
        await writable.write(JSON.stringify(cityData, null, 2));
        await writable.close();
        document.getElementById("folderStatus").innerText = `💾 Guardado: ${suggestedName}`;
        await listCityFiles();
    } catch (err) {
        console.error(err);
        alert("Error al guardar en la carpeta.");
    }
}

async function loadCityFromFolder(fileName) {
    if (!ciudadesHandle) return;
    try {
        const fileHandle = await ciudadesHandle.getFileHandle(fileName);
        const file = await fileHandle.getFile();
        const text = await file.text();
        const data = JSON.parse(text);
        importCityData(data);
        document.getElementById("folderStatus").innerText = `📂 Cargado: ${fileName}`;
    } catch (err) {
        console.error(err);
        alert("Error al cargar el archivo.");
    }
}

function importCityData(data) {
    if (!data || !data.grid || !data.mode) {
        alert("Formato de archivo inválido.");
        return false;
    }
    currentMode = data.mode;
    document.getElementById("modeSelect").value = currentMode;
    SIZE = data.grid.length;
    const sizeSel = document.getElementById("sizeSelect");
    if (sizeSel) {
        const valid = [...sizeSel.options].some(o => parseInt(o.value) === SIZE);
        if (valid) sizeSel.value = SIZE;
    }
    currentGrid = data.grid.map(row => row.map(cell => ({
        type: T[cell.t] || T.EMPTY,
        building: cell.b ? BUILDINGS[cell.b] : null,
        buildingId: cell.id,
        isEntrance: cell.e,
        isMainIcon: cell.m,
        zone: cell.z,
        info: cell.i
    })));
    render();
    renderLegend();
    return true;
}

// Sobrescribir la función exportMap para que use la carpeta si está disponible
window.exportMap = function() {
    if (!currentGrid) return;
    const serializedGrid = currentGrid.map(row => row.map(cell => {
        const typeKey = Object.keys(T).find(key => T[key] === cell.type) || "EMPTY";
        const bldKey = cell.building ? Object.keys(BUILDINGS).find(key => BUILDINGS[key] === cell.building) : null;
        return {
            t: typeKey, b: bldKey, id: cell.buildingId, e: cell.isEntrance,
            m: cell.isMainIcon, z: cell.zone, i: cell.info
        };
    }));
    const data = { mode: currentMode, grid: serializedGrid };
    const suggestedName = `ciudad_${currentMode}_${Date.now()}.json`;
    saveCityToFolder(data, suggestedName);
};

// Conectar eventos de la interfaz de carpeta
document.getElementById("selectFolderBtn").addEventListener("click", selectDirectory);
document.getElementById("loadSelectedBtn").addEventListener("click", () => {
    const selected = document.getElementById("citySelect").value;
    if (selected) loadCityFromFolder(selected);
    else alert("Selecciona una ciudad.");
});

// Inicialización principal
document.addEventListener("DOMContentLoaded", () => {
    const sel = document.getElementById("modeSelect");
    sel.innerHTML = "";
    for (let [id, m] of Object.entries(MODES)) {
        const opt = document.createElement("option");
        opt.value = id;
        opt.textContent = m.label;
        sel.appendChild(opt);
    }
    
    document.getElementById("regenerateBtn").addEventListener("click", regenerate);
    // Reemplazar el evento del botón exportar por nuestra versión mejorada
    const exportBtn = document.getElementById("exportBtn");
    if (exportBtn) {
        // Quitar listeners anteriores clonando y reemplazando (para evitar duplicados)
        const newExportBtn = exportBtn.cloneNode(true);
        exportBtn.parentNode.replaceChild(newExportBtn, exportBtn);
        newExportBtn.addEventListener("click", window.exportMap);
    }
    document.getElementById("importBtn").addEventListener("click", () => document.getElementById("importFile").click());
    document.getElementById("importFile").addEventListener("change", importMap);
    
    regenerate();
});