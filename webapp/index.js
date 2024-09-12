sap.ui.define([
	"sap/ui/core/ComponentContainer"
], (ComponentContainer) => {
	"use strict";

	new ComponentContainer({
		name: "ui5.mock",
		settings : {
			id : "mock"
		},
		async: true
	}).placeAt("content");
});
