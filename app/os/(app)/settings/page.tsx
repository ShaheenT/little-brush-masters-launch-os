import OSNav from "../../components/OSNav";

export default function SettingsPage() {
  return (
    <div className="lbmOsLayout">
      <OSNav />

      <main className="lbmOsMain">
        <header className="lbmOsHeader">
          <div>
            <p className="lbmOsEyebrow">
              LBMOS · ADMINISTRATION
            </p>
            <h1>Settings</h1>
            <p>
              Configure the Little Brush Masters
              operating system.
            </p>
          </div>
        </header>

        <section className="lbmOsCard">
          <h2>System settings</h2>
          <p>
            Account, notifications, business
            configuration and integrations will be
            managed here.
          </p>
        </section>
      </main>
    </div>
  );
}
