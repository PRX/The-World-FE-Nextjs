const taxonomySlugToSingularName = new Map<string, string>();
taxonomySlugToSingularName.set("cities", "city");
taxonomySlugToSingularName.set("continents", "continent");
taxonomySlugToSingularName.set("countries", "country");
taxonomySlugToSingularName.set("people", "person");
taxonomySlugToSingularName.set("provinces_or_states", "provinceOrState");
taxonomySlugToSingularName.set("regions", "region");
taxonomySlugToSingularName.set("social_tags", "socialTag");

export { taxonomySlugToSingularName };
