import { Button } from "../ui";
import { PencilIcon, PauseIcon, ResumeIcon, TrashIcon } from "../icons";

export function InventoryTable({ products, onToggleActive, onDeleteProduct }) {
  return (
    <div className="w-full overflow-x-auto border border-secondary border-b-0">
      <table className="min-w-full">
        <thead className="border-b text-left">
          <tr>
            <th className="py-2 px-4">Prenda</th>
            <th className="py-2 px-4">Variantes</th>
            <th className="py-2 px-4">Precio Mín.</th>
            <th className="py-2 px-4">Stock Total</th>
            <th className="py-2 px-4">Estado</th>
            <th className="py-2 px-4">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {products.map((product) => (
            <tr key={product.id} className="border-b">
              <td className="py-2 px-4">
                <div className="flex items-center gap-4">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-32 h-32 object-cover"
                  />
                  <h4>{product.name}</h4>
                </div>
              </td>
              <td className="py-2 px-4">3</td>
              <td className="py-2 px-4">${product.price.toFixed(2)}</td>
              <td className="py-2 px-4">{product.stock}</td>
              <td className="py-2 px-4">
                {product.isActive ? "Activa" : "Inactiva"}
              </td>
              <td className="py-2 px-4 w-1">
                <div className="flex gap-2">
                  <Button
                    to={`/sell/edit/${product.id}`}
                    variant="outline"
                    className="p-4!"
                  >
                    <PencilIcon />
                  </Button>
                  <Button
                    variant="outline"
                    className="p-4!"
                    onClick={() => onToggleActive(product.id)}
                  >
                    {product.isActive ? <PauseIcon /> : <ResumeIcon />}
                  </Button>
                  <Button
                    variant="inverted"
                    className="p-4!"
                    onClick={() => onDeleteProduct(product.id)}
                  >
                    <TrashIcon />
                  </Button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
