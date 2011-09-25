if (typeof Object.create !== 'function') {
    Object.create = function (o) {
        function F() {} 
        F.prototype = o;
        return new F();
    };
}

var parseDecimal = function(str) {
    if (typeof str !== "string") {
	return str;
    }
    return parseFloat( str.replace(".","").replace(",",".") );
};

var Item = {
    item: "",
    euros: 0,

    properties: ["item", "euros"],

    lables: {
	item: "Concepto",
	euros: "Euros"
    },

    cast: function () {
	this.euros = parseDecimal(this.euros);
	}
};

var Property = {
    features: "",
    place: "",
    purchase: 0,
    right: "",

    properties: ["features", "place", "purchase", "right"],

    labels: {
	features: "Características",
	place: "Situación",
	purchase: "Adquisición",
	right: "Derecho"
    },

    cast: function () { //TODO: Parsear la fecha y el lugar
	this.purchase = parseDecimal(this.purchase);
	}
};

var Loan = {
    item: "",
    granting: "",			// date
    amount: 0,
    unpaid: 0,

    properties: ["item", "granting", "amount", "unpaid"],

    lables: {
	item: "Descripción",
	granting: "Fecha Concesión",
	amount: "Concedido",
	unpaid: "Pendiente"
    },

    cast: function () {  //TODO: Parsear la fecha
	this.amount = parseDecimal(this.amount);
	this.unpaid = parseDecimal(this.unpaid);
	}
};

var Vehicle = { 
    purchase: "",			// date
    item: "",

    properties: ["purchase", "item"],

    labels: {
	purchase: "Fecha adquisición",
	item: "Descripción"
    },

    cast: function () {}  //TODO: Parsear la fecha
};

var Senator = {
    acta: 0,
    name: "",
    group: "",
    declaration_url: "",
    adoptive_father: "",
    highlights: "",
    marital_status: "",
    matrimonial: "",
    declaration_date: "",
    region: "",
    irpf: 0,
    salaries: [],			// [Item]
    dividend: Object.create(Item),	// Item
    interest: Object.create(Item),       // Item
    other_incomes: [],			// [Item]
    urban_properties: [],		// [Property]
    rural_properties: [],		// [Properyy]
    society_properties: [],		// [Properyy]
    deposits: [],			// [Item]
    shares: [],				// [Item]
    societes: "",
    vehicles: [],			// [Vehicle]
    other_properties: [],		// [Item]
    loans: [],				// [Loan]
    others_debts: "",
    notes: "",
    
    labels: {
	acta: "Acta",
	name: "Nombre del senador",
	group: "Grupo parlamentario",
	declaration_url: "Declaración de bienes",
	adoptive_father: "Adoptado por",
	highlights: "Notas: dudas, cosas interesantes, irregularidades... ",
	marital_status: "Estado Civil",
	matrimonial: "Regimen matrimonial",
	declaration_date: "Fecha declaración",
	region: "Circunscripción",
	irpf: "Cantidad pagada IRPF",
	salaries: "Salarios",
	dividend: "Dividendos",
	interest: "Intereses",
	other_incomes: "Otras rentas",
	urban_properties: "Bienes urbanos",
	rural_properties: "Bienes rústicos",
	society_property: "Bienes sociedades",
	deposits: "Depósitos",
	shares: "Deuda pública o Acciones",
	societes: "Sociedades participadas",
	vehicles: "Vehículos",
	other_properties: "Otros bienes",
	loans: "Préstamos",
	others_debts: "Otras deudas",
	notes: "Observaciones"
    },

    cast: function () { //TODO: Parsear la fecha y la región
	this.acta = parseInt(this.acta);
	this.irpf = parseDecimal(this.irpf);
	}
};
