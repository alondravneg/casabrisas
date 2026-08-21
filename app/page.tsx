export const dynamic = "force-dynamic";
export const revalidate = 0;

import { supabase } from "@/utils/supabase";
import Card from "./components/Card";
import ImprovementCard from "./components/ImprovementCard";

export default async function Home() {
  const { data: improvements } = await supabase.from("improvements").select(`
    *,
    improvement_images (
      image_url
    )
  `);

  const totalInvertido =
    improvements?.reduce(
      (acc, item) => acc + item.material_cost + item.labor_cost,
      0,
    ) ?? 0;

  const rentaMensual = 15000;

  const mesesCubiertos = Math.floor(totalInvertido / rentaMensual);

  const fechaInicio = new Date(2026, 11, 1); // Enero 2027

  const proximaRenta = new Date(fechaInicio);

  proximaRenta.setMonth(proximaRenta.getMonth() + mesesCubiertos);

  const nombreMes = proximaRenta.toLocaleDateString("es-MX", {
    month: "long",
    year: "numeric",
  });

  const nombreMesCapitalizado =
    nombreMes.charAt(0).toUpperCase() + nombreMes.slice(1);

  const creditoActual = totalInvertido % rentaMensual;

  const faltante = rentaMensual - creditoActual;

  const porcentaje = (creditoActual / rentaMensual) * 100;

  return (
    <main className="container">
      <h1 className="improvements-title">🏠 Casa Brisas</h1>

      <div className="cards">
        <Card
          title="📆 Renta mensual acordada"
          value={`$${rentaMensual.toLocaleString()}`}
        />

        <Card
          title="💰 Total invertido"
          value={`$${totalInvertido.toLocaleString()}`}
        />

        <Card
          title="📅 Meses totales cubiertos"
          value={mesesCubiertos.toString()}
        />

        <Card
          title={`💵 Crédito acumulado para ${nombreMesCapitalizado}`}
          value={`$${creditoActual.toLocaleString()}`}
        />

        <Card
          title="📅 Próxima renta a vencer, considerando los meses ya cubiertos"
          value={nombreMesCapitalizado}
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
          <ImprovementCard key={item.id} item={item} />
        ))}
      </div>
    </main>
  );
}
