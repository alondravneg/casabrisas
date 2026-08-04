import AddImprovementForm from "../components/AddImprovementForm";


export default function Admin() {
  return (
    <main style={{ padding: "2rem" }}>
      <h1>Panel de administración</h1>

      <AddImprovementForm />
    </main>
  );
}