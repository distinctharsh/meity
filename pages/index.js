import Header from "../components/Header";

export default function Home() {
  return (
    <>
    <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined" rel="stylesheet" />
      <Header />
      <main id="main" className="p-6">
        <h2 className="text-2xl font-bold">Welcome  🚀</h2>
        <p>This is the homepage content.</p>
      </main>
    </>
  );
}
