
import './App.css'
import { Button, Card } from "antd";
const App = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <Card title="Ant Design + Tailwind Test" className="w-96">
        <p className="mb-4 text-gray-600">
          Eğer bu görünüyorsa kurulum tamam.
        </p>
        <Button type="primary" block>
          Test Button
        </Button>
        <p class="font-sans ...">The quick brown fox ...</p>
<p class="font-serif ...">The quick brown fox ...</p>
<p class="font-mono ...">The quick brown fox ...</p>
<p className="font-sans hover:text-red-400">
test dennmee
</p>
      </Card>
    </div>
  );
};

export default App;