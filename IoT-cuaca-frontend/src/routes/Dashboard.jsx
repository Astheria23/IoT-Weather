import { useMemo } from "react";
import { Line } from "react-chartjs-2";
import { useDashboardData } from "../hooks/useDashboardData.js";
import { useAuth } from "../hooks/useAuth.js";
import MetricChart from "../components/MetricChart.jsx";
import StatPill from "../components/StatPill.jsx";
import CloudAnimation from "../components/CloudAnimation.jsx";

const Dashboard = () => {
  const { logout } = useAuth();
  const { data, loading, error } = useDashboardData();

  const labels = useMemo(
    () =>
      data.map((item) =>
        new Date(item.created_at ?? Date.now()).toLocaleTimeString(),
      ),
    [data],
  );

  const tempSeries = useMemo(() => data.map((item) => item.temp ?? 0), [data]);
  const rainSeries = useMemo(
    () => data.map((item) => item.rain_level ?? 0),
    [data],
  );
  const windSeries = useMemo(
    () => data.map((item) => item.wind_speed ?? 0),
    [data],
  );

  const latest = data.length ? data[data.length - 1] : null;

  return (
    <main className="min-h-screen bg-slate-100 text-slate-900 p-6">
      <div className="w-full">
        <div className="bg-blue-600 text-white px-10 py-4 mb-8 shadow-md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.3em] opacity-90">Monitoring Cuaca</p>
              <h1 className="text-3xl font-bold">Weather Real-time</h1>
            </div>
            <div className="hidden md:flex items-center gap-6">
              <button
                onClick={logout}
                className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded-lg font-bold transition"
              >
                Logout
              </button>
            </div>
          </div>
        </div>

        {error && (
          <div className="mb-6 rounded-lg border border-red-400 bg-red-50 p-4 text-red-700">
            {error.message || "Gagal memuat data cuaca."}
          </div>
        )}

        {loading ? (
          <div className="text-center text-slate-400">Memuat data sensor...</div>
        ) : (
          <>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
            {/* Left: big cloud / illustration */}
            <div className="col-span-1 flex items-start justify-center pt-4">
              <div className="w-full max-w-sm">
                <div className="flex items-center justify-center p-8 bg-white rounded-xl border border-slate-200 shadow-sm">
                  <CloudAnimation
                    className="w-56 h-56"
                    temp={latest?.temp}
                    rain={latest?.rain_level}
                    wind={latest?.wind_speed}
                  />
                </div>
              </div>
            </div>

            {/* Right: metrics + charts (data nyata) */}
            <div className="col-span-2">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
                <StatPill
                  icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m8-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707"/></svg>}
                  value={latest ? `${latest.temp ?? '-'} °C` : '-'}
                  label="Suhu"
                />
                <StatPill
                  icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2a7 7 0 017 7c0 7-7 13-7 13S5 16 5 9a7 7 0 017-7z"/></svg>}
                  value={latest ? `${latest.rain_level ?? '-'} mm` : '-'}
                  label="Curah Hujan"
                />
                <StatPill
                  icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3"/></svg>}
                  value={latest ? new Date(latest.created_at).toLocaleTimeString() : '-'}
                  label="Waktu"
                />
              </div>

              <div className="mb-6">
                <div className="text-sm text-slate-500 mb-3">Data Nyata (terkini) - Angin & Curah Hujan</div>
                <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm h-56">
                  <Line
                    data={{
                      labels,
                      datasets: [
                        {
                          label: "Curah Hujan (mm)",
                          data: rainSeries,
                          borderColor: "#60a5fa",
                          backgroundColor: "#60a5fa33",
                          fill: false,
                          tension: 0,
                          pointRadius: 3,
                        },
                        {
                          label: "Kecepatan Angin (m/s)",
                          data: windSeries,
                          borderColor: "#f97316", // orange
                          backgroundColor: "#f9731633",
                          fill: false,
                          tension: 0,
                          pointRadius: 3,
                        },
                      ],
                    }}
                    options={{
                      responsive: true,
                      maintainAspectRatio: false,
                      plugins: { legend: { display: false } },
                      scales: {
                        x: {
                          ticks: { color: "#64748b" },
                          grid: { color: "#e5e7eb" },
                        },
                        y: {
                          ticks: { color: "#64748b" },
                          grid: { color: "#e5e7eb" },
                        },
                      },
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
          {/* Data Suhu full width di bawah data nyata */}
          <div className="mt-6">
            <div className="text-sm text-slate-500 mb-3">Data Nyata - Suhu</div>
            <MetricChart
              title="Perubahan Suhu"
              labels={labels}
              values={tempSeries}
              borderColor="#3b82f6"
              height="h-80"
              fillArea={true}
            />
          </div>
          </>
        )}
      </div>
    </main>
  );
};

export default Dashboard;
