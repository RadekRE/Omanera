import { getProjects, getLocations } from "../src/lib/projects";
const p = getProjects(); getLocations();
console.log(`OK: ${p.length} publikovaných projektů`);
