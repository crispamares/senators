

var SUBCONCEPTS = 0; // Line with the subconcepts
var CONCEPTS = 1;    // Line with the subconcepts

var main;		// FIXME: implement a cleaner hook

var SenatorParser = {
    monovalued : ["acta", "name", "group", "declaration_url", "adoptive_father", "highlights", "marital_status", "matrimonial", "declaration_date", "region", "irpf", "societes", "others_debts", "notes" ],
    
    multivalued: [ {prop:"salaries", obj:Item, initial_index:10, num:4},
		   {prop:"dividend", obj:Item, initial_index:18, num:1}, 
		   {prop:"interest", obj:Item, initial_index:20, num:1},
		   {prop:"other_incomes", obj:Item, initial_index:22, num:3},
		   {prop:"urban_properties", obj:Property, initial_index:29, num:6}, 
		   {prop:"rural_properties", obj:Property, initial_index:53, num:3},
		   {prop:"society_properties", obj:Property, initial_index:65, num:4},
		   {prop:"deposits", obj:Item, initial_index:81, num:5},
		   {prop:"shares", obj:Item, initial_index:91, num:8},
		   {prop:"vehicles", obj:Vehicle, initial_index:108, num:4}, 
		   {prop:"other_properties", obj:Item, initial_index:116, num:4},
		   {prop:"loans", obj:Loan, initial_index:124, num:5}
		 ],

    parse_monovalued : function(senator, row, labels_row) {
	for (var i = 0, n = this.monovalued.length, j, prop; i < n; i++) {
	    prop = this.monovalued[i];
	    j = labels_row.indexOf(senator.labels[prop]);
	    senator[prop] = row[j] || senator[prop];
	    senator.cast();
	}
    },

    parse_mulivalued : function(senator, row) {
	for (var i = 0, n = this.multivalued.length, prop, obj, n_fields; i < n; i++) {
	    obj = this.multivalued[i].obj;

	    prop = this.multivalued[i].prop;
	    n_fields = obj.properties.length;

	    for (var j = 0, m = this.multivalued[i].num, filled; j < m; j++) {
		obj = Object.create(this.multivalued[i].obj);
		filled = false;

		for (var k = 0, index; k < n_fields; k++) {

		    index = (n_fields * j + k) + this.multivalued[i].initial_index;

//		    console.log(index + ":" + prop + " n_fields:" + n_fields + 
//				" fill: "+ obj.properties[k] + " text: " + row[index]);

		    obj[obj.properties[k]] = row[index] || obj[obj.properties[k]];
		    filled = filled || Boolean(row[index]);
		}
		if (filled) {
		obj.cast();

		if (this.multivalued[i].num == 1)
		    senator[prop] = obj;
		else
		    senator[prop].push(obj);		    
		}
	    }
	}
    }

};

var senators = [];

d3.text("data/declaracion_senadores.csv", function(csv) {
	    var info = d3.csv.parseRows(csv);
	    var labels_row = info[CONCEPTS];

	    for (var i = CONCEPTS+1, n = info.length; i < n; i++) {
//	    for (var i = CONCEPTS+6, n = 8; i < n; i++) {
		var senator = Object.create(Senator);
		
		SenatorParser.parse_monovalued(senator, info[i], labels_row);
		SenatorParser.parse_mulivalued(senator, info[i]);
		senators.push(senator);

	    }
	    
	    main(senators);
	}
       );


