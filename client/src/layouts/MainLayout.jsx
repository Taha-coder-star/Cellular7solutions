import { Outlet } from 'react-router-dom';

export default function MainLayout() {
  return (
    <div>
      <div>Navbar placeholder</div>
      <main>
        <Outlet />
      </main>
      <div>Footer placeholder</div>
    </div>
  );
}
