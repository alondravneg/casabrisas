import { supabase } from "@/utils/supabase";
import Card from "./components/Card";

export default async function Home() {
  const { data: improvements } = await supabase
    .from("improvements")
    .select("*");

  const totalInvertido =
    improvements?.reduce(
      (acc, item) => acc + item.material_cost + item.labor_cost,
      0,
    ) ?? 0;

  const rentaMensual = 15000;

  const mesesCubiertos = Math.floor(totalInvertido / rentaMensual);

  const creditoActual = totalInvertido % rentaMensual;

  const faltante = rentaMensual - creditoActual;

  const porcentaje = (creditoActual / rentaMensual) * 100;

  return (
    <main className="container">
      <h1 className="title">🏠 Casa Brisas</h1>

      <div className="cards">
        <Card
          title="💰 Total invertido"
          value={`$${totalInvertido.toLocaleString()}`}
        />

        <Card title="📅 Meses cubiertos" value={mesesCubiertos.toString()} />

        <Card
          title="💵 Crédito acumulado"
          value={`$${creditoActual.toLocaleString()}`}
        />

        <Card
          title="📆 Renta mensual"
          value={`$${rentaMensual.toLocaleString()}`}
        />
      </div>

      <div className="progress-card">
        <h3>📈 Progreso del siguiente mes</h3>

        <div className="progress-bar">
          <div
            className="progress-fill"
            style={{
              width: `${porcentaje}%`,
            }}
          />
        </div>

        <p>{porcentaje.toFixed(0)}% completado</p>

        <p>
          Faltan <strong>${faltante.toLocaleString()}</strong> para cubrir el
          siguiente mes.
        </p>
      </div>

      <h2 className="improvements-title">🔨 Mejoras</h2>

      <div className="improvements">
        {improvements?.map((item) => (
          <div key={item.id} className="improvement-card">
            {item.image_url && (
              <a
                href={item.image_url}
                target="_blank"
                rel="noopener noreferrer"
              >
                {item.image_url && (
                  <>
                    <p style={{ color: "red" }}>Imagen encontrada ✅</p>

                    <img
                      src={item.image_url}
                      alt={item.title}
                      style={{
                        display: "block",
                        width: "100%",
                        minHeight: "120px",
                        objectFit: "cover",
                        borderRadius: "12px",
                        marginBottom: "1rem",
                        border: "3px solid blue",
                      }}
                    />
                  </>
                )}
              </a>
            )}

            <h3>{item.title}</h3>

            <p>{item.category}</p>

            <p>{item.date}</p>

            <strong>
              ${(item.material_cost + item.labor_cost).toLocaleString()}
            </strong>
          </div>
        ))}
      </div>
    </main>
  );
}
