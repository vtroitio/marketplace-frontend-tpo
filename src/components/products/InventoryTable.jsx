import { Button } from "../ui";
import { PencilIcon, PauseIcon, ResumeIcon, TrashIcon } from "../icons";

const API_URL = import.meta.env.VITE_API_URL;

function resolveImageUrl(path) {
  if (!path) return null;
  if (path.startsWith("http")) return path;
  return `${API_URL}${path}`;
}

export function InventoryTable({ products, onToggleActive, onDeleteProduct }) {
  return (
    <div className="w-full border border-secondary border-b-0">
      <table className="w-full table-fixed">
        <thead className="border-b text-left">
          <tr>
            <th className="py-2 px-4 w-1/2">Prenda</th>
            <th className="py-2 px-4 text-center w-24">Variantes</th>
            <th className="py-2 px-4 w-32">Precio Mín.</th>
            <th className="py-2 px-4 text-center w-28">Stock Total</th>
            <th className="py-2 px-4 text-center w-32">Estado</th>
            <th className="py-2 px-4 text-center w-44">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {products.map((product) => (
            <tr key={product.id} className="border-b">
              <td className="py-2 px-4 max-w-0 overflow-hidden">
                <div className="flex items-center gap-4">
                  <div className="w-32 h-32 bg-secondary flex-shrink-0 overflow-hidden">
                    {product.coverImagePath && (
                      <img
                        src={resolveImageUrl(product.coverImagePath)}
                        alt={product.name}
                        className="w-full h-full object-cover"
                      />
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <h4 className="truncate">{product.name}</h4>
                  </div>
                </div>
              </td>
              <td className="py-2 px-4 text-center">{product.totalVariants || 0}</td>
              <td className="py-2 px-4">${product.price.toFixed(2)}</td>
              <td className="py-2 px-4 text-center">{product.totalStock || 0}</td>
              <td className="py-2 px-4">
                <div
                  className="flex items-center justify-center py-1 mx-auto"
                  style={{
                    width: "90px",
                    background: product.isActive ? "#d1fae5" : "#f3f4f6",
                    borderRadius: "999px",
                  }}
                >
                  <span
                    style={{
                      fontSize: "0.8rem",
                      color: product.isActive ? "#065f46" : "#6b7280",
                      fontWeight: 500,
                    }}
                  >
                    {product.isActive ? "Activa" : "Inactiva"}
                  </span>
                </div>
              </td>
              <td className="py-2 px-4">
                <div className="flex gap-3 justify-center">
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
                    onClick={() => onToggleActive(product.id, product.isActive)}
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