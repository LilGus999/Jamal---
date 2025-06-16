
import { useState, useEffect } from "react";
// Importar EsfihaInput e Esfiha
import { Esfiha, EsfihaInput, esfihaAPI, formatarPreco } from "../lib/api";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "./ui/dialog";
import { Pencil, Trash2, Plus } from "lucide-react";

// Estado inicial para o formulário, usando EsfihaInput como base
const initialFormData: EsfihaInput = {
  nome: "",
  descricao: "",
  preco: 0,
  categoria: "",
  disponivel: true,
  imagem_url: "",
};

export function AdminEsfihas() {
  const [esfihas, setEsfihas] = useState<Esfiha[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState<string | null>(null);
  const [modalAberto, setModalAberto] = useState(false);
  const [esfihaAtual, setEsfihaAtual] = useState<Esfiha | null>(null); // Mantém a esfiha completa para edição
  // Usar EsfihaInput para o estado do formulário
  const [formData, setFormData] = useState<EsfihaInput>(initialFormData);

  useEffect(() => {
    carregarEsfihas();
  }, []);

  const carregarEsfihas = async () => {
    try {
      setCarregando(true);
      const data = await esfihaAPI.listar();
      setEsfihas(data);
      setErro(null);
    } catch (error: any) {
      console.error("Erro ao carregar esfihas:", error);
      setErro(
        error.message ||
          "Não foi possível carregar as esfihas. Tente novamente."
      );
    } finally {
      setCarregando(false);
    }
  };

  const handleInputChange = (
    campo: keyof EsfihaInput, // Usar chaves de EsfihaInput
    valor: string | number | boolean
  ) => {
    setFormData((prev) => ({
      ...prev,
      [campo]:
        campo === "preco"
          ? parseFloat(valor as string) || 0
          : campo === "disponivel"
          ? Boolean(valor)
          : valor,
    }));
  };

  const abrirModalCriar = () => {
    setEsfihaAtual(null);
    setFormData(initialFormData); // Resetar para o estado inicial
    setModalAberto(true);
  };

  const abrirModalEditar = (esfiha: Esfiha) => {
    setEsfihaAtual(esfiha);
    // Preencher formData com os dados da esfiha (sem o id)
    setFormData({
      nome: esfiha.nome,
      descricao: esfiha.descricao || "",
      preco: esfiha.preco,
      categoria: esfiha.categoria || "",
      disponivel: esfiha.disponivel,
      imagem_url: esfiha.imagem_url || "",
    });
    setModalAberto(true);
  };

  const salvarEsfiha = async () => {
    if (!formData.nome || !formData.preco || formData.preco <= 0) {
      alert("Nome e preço (maior que zero) são obrigatórios!");
      return;
    }

    // formData já está no formato EsfihaInput
    const esfihaData: EsfihaInput = {
        ...formData,
        // Garantir que campos opcionais sejam tratados se necessário
        descricao: formData.descricao || undefined,
        categoria: formData.categoria || undefined,
        imagem_url: formData.imagem_url || undefined,
    };

    try {
      if (esfihaAtual && esfihaAtual.id !== undefined) {
        // Editando: usar esfihaAtual.id e esfihaData (que é EsfihaInput)
        // A API espera Partial<EsfihaInput> ou EsfihaInput para atualizar
        await esfihaAPI.atualizar(esfihaAtual.id, esfihaData);
      } else {
        // Criando: usar esfihaData (que é EsfihaInput)
        await esfihaAPI.criar(esfihaData);
      }

      setModalAberto(false);
      carregarEsfihas();
    } catch (error: any) {
      console.error("Erro ao salvar esfiha:", error);
      alert(error.message || "Não foi possível salvar a esfiha. Tente novamente.");
    }
  };

  const excluirEsfiha = async (id: number) => {
    if (!confirm("Tem certeza que deseja excluir esta esfiha?")) {
      return;
    }

    try {
      await esfihaAPI.excluir(id);
      carregarEsfihas();
    } catch (error: any) {
      console.error("Erro ao excluir esfiha:", error);
      alert(error.message || "Não foi possível excluir a esfiha. Tente novamente.");
    }
  };

  if (carregando) {
    return <div className="flex justify-center p-8">Carregando...</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Gestão de Esfihas</h1>
        <Button onClick={abrirModalCriar}>
          <Plus className="mr-2 h-4 w-4" /> Nova Esfiha
        </Button>
      </div>

      {erro && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {erro}
        </div>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Catálogo de Esfihas</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nome</TableHead>
                <TableHead>Categoria</TableHead>
                <TableHead>Preço</TableHead>
                <TableHead>Disponível</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {esfihas.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-4">
                    Nenhuma esfiha cadastrada
                  </TableCell>
                </TableRow>
              ) : (
                esfihas.map((esfiha) => (
                  <TableRow key={esfiha.id}>
                    <TableCell className="font-medium">{esfiha.nome}</TableCell>
                    <TableCell>{esfiha.categoria || "-"}</TableCell>
                    <TableCell>{formatarPreco(esfiha.preco)}</TableCell>
                    <TableCell>
                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          checked={esfiha.disponivel}
                          onChange={async () => {
                            try {
                              // Atualizar apenas a disponibilidade
                              await esfihaAPI.atualizar(esfiha.id, {
                                disponivel: !esfiha.disponivel,
                              });
                              // Atualizar estado local para refletir mudança
                              setEsfihas(esfihas.map(e => e.id === esfiha.id ? {...e, disponivel: !e.disponivel} : e));
                            } catch (error: any) {
                              console.error("Erro ao atualizar disponibilidade:", error);
                              alert(error.message || "Erro ao atualizar disponibilidade.")
                            }
                          }}
                          className="mr-2 h-4 w-4"
                        />
                        {esfiha.disponivel ? "Sim" : "Não"}
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => abrirModalEditar(esfiha)}
                      >
                        <Pencil size={16} />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-red-500 hover:text-red-700"
                        onClick={() => excluirEsfiha(esfiha.id)}
                      >
                        <Trash2 size={16} />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Dialog open={modalAberto} onOpenChange={setModalAberto}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {esfihaAtual ? "Editar Esfiha" : "Nova Esfiha"}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div>
              <label htmlFor="nome" className="block text-sm font-medium mb-1">
                Nome *
              </label>
              <Input
                id="nome"
                value={formData.nome || ""}
                onChange={(e) => handleInputChange("nome", e.target.value)}
                placeholder="Nome da esfiha"
              />
            </div>

            <div>
              <label htmlFor="descricao" className="block text-sm font-medium mb-1">
                Descrição
              </label>
              <Textarea
                id="descricao"
                value={formData.descricao || ""}
                onChange={(e) => handleInputChange("descricao", e.target.value)}
                placeholder="Descrição da esfiha"
                rows={3}
              />
            </div>

            <div>
              <label htmlFor="preco" className="block text-sm font-medium mb-1">
                Preço *
              </label>
              <Input
                id="preco"
                type="number"
                min="0"
                step="0.01"
                value={formData.preco || 0}
                onChange={(e) => handleInputChange("preco", e.target.value)}
                placeholder="0.00"
              />
            </div>

            <div>
              <label htmlFor="categoria" className="block text-sm font-medium mb-1">
                Categoria
              </label>
              <Input
                id="categoria"
                value={formData.categoria || ""}
                onChange={(e) => handleInputChange("categoria", e.target.value)}
                placeholder="Ex: Salgada, Doce, Vegetariana"
              />
            </div>

            <div>
              <label htmlFor="imagem_url" className="block text-sm font-medium mb-1">
                URL da Imagem
              </label>
              <Input
                id="imagem_url"
                value={formData.imagem_url || ""}
                onChange={(e) => handleInputChange("imagem_url", e.target.value)}
                placeholder="https://exemplo.com/imagem.jpg"
              />
            </div>

            <div className="flex items-center">
              <input
                id="disponivel"
                type="checkbox"
                checked={formData.disponivel ?? true}
                onChange={(e) => handleInputChange("disponivel", e.target.checked)}
                className="mr-2 h-4 w-4"
              />
              <label htmlFor="disponivel">Disponível para venda</label>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setModalAberto(false)}>
              Cancelar
            </Button>
            <Button onClick={salvarEsfiha}>Salvar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

