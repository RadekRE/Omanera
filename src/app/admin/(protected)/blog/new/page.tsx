import PostForm from "@/components/admin/PostForm";
import { savePostAction } from "../actions";
export default function NewPost() { return <><h1>Nový článek</h1><PostForm posts={[]} action={savePostAction} /></>; }
