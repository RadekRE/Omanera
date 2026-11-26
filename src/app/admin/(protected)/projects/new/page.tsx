import ProjectForm from "@/components/admin/ProjectForm";
import { saveProjectAction } from "../actions";
export default function NewProject() { return <><h1>Nový projekt</h1><ProjectForm action={saveProjectAction} isNew /></>; }
