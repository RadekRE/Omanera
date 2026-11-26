import { getProjects, getLocations } from "../src/lib/projects";
(async () => { const p = await getProjects(); getLocations(); console.log(`OK: ${p.length} publikovaných projektů`); })();
