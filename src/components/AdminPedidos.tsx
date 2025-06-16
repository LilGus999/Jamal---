
import { useState, useEffect } from "react";
// Remover ItemPedido se não for usado aqui
import { pedidoAPI, StatusPedido, formatarPreco, Pedido } from "../lib/api";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./ui/table";
import { Badge } from "./ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";

export function AdminPedidos() {
  const [pedidos, setPedidos] = useState<Pedido[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState<string | null>(null);
  const [filtroStatus, setFiltroStatus] = useState("todos");

  useEffect(() => {
    carregarPedidos();
  }, []);

  const carregarPedidos = async () => {
    try {
      setCarregando(true);
      const data = await pedidoAPI.listarTodosAdmin();
      setPedidos(data);
      setErro(null);
    } catch (error: any) {
      console.error("Erro ao carregar pedidos:", error);
      setErro(
        error.message ||
          "Não foi possível carregar os pedidos. Tente novamente."
      );
    } finally {
      setCarregando(false);
    }
  };

  const atualizarStatus = async (id: number, novoStatus: string) => {
    if (typeof id !== "number") {
      console.error("ID inválido para atualizar status:", id);
      alert("Ocorreu um erro interno (ID inválido).");
      return;
    }
    try {
      await pedidoAPI.atualizarStatusAdmin(id, novoStatus);
      setPedidos((pedidosAtuais) =>
        pedidosAtuais.map((p) =>
          p.id === id ? { ...p, status: novoStatus } : p
        )
      );
    } catch (error: any) {
      console.error("Erro ao atualizar status:", error);
      alert(
        error.message ||
          "Não foi possível atualizar o status do pedido. Tente novamente."
      );
    }
  };

  const getStatusBadgeColor = (status: string | undefined): string => {
    switch (status) {
      case StatusPedido.PAGAMENTO_PENDENTE:
        return "bg-orange-500";
      case StatusPedido.PENDENTE:
        return "bg-yellow-500";
      case StatusPedido.APROVADO:
        return "bg-blue-500";
      case StatusPedido.RECUSADO:
      case StatusPedido.FALHA_PAGAMENTO:
        return "bg-red-500";
      case StatusPedido.EM_PREPARACAO:
        return "bg-purple-500";
      case StatusPedido.A_CAMINHO:
        return "bg-indigo-500";
      case StatusPedido.PRONTO_RETIRADA:
        return "bg-cyan-500";
      case StatusPedido.ENTREGUE:
        return "bg-green-500";
      case StatusPedido.CANCELADO:
        return "bg-gray-500";
      default:
        return "bg-gray-400";
    }
  };

  const formatarData = (dataString: string | undefined): string => {
    if (!dataString) return "-";
    try {
      const data = new Date(dataString);
      return data.toLocaleString("pt-BR");
    } catch (e) {
      return "Data inválida";
    }
  };

  const pedidosFiltrados = filtroStatus === "todos"
      ? pedidos
      : pedidos.filter(pedido => pedido.status === filtroStatus);

  if (carregando) {
    return <div className="flex justify-center p-8">Carregando...</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Gestão de Pedidos</h1>
        <div className="flex items-center gap-2">
          <span>Filtrar por status:</span>
          <Select value={filtroStatus} onValueChange={setFiltroStatus}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Todos" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="todos">Todos</SelectItem>
              <SelectItem value={StatusPedido.PAGAMENTO_PENDENTE}>Pag. Pendente</SelectItem>
              <SelectItem value={StatusPedido.PENDENTE}>Pendente</SelectItem>
              <SelectItem value={StatusPedido.APROVADO}>Aprovado</SelectItem>
              <SelectItem value={StatusPedido.EM_PREPARACAO}>Em Preparação</SelectItem>
              <SelectItem value={StatusPedido.A_CAMINHO}>A Caminho</SelectItem>
              <SelectItem value={StatusPedido.PRONTO_RETIRADA}>Pronto Retirada</SelectItem>
              <SelectItem value={StatusPedido.ENTREGUE}>Entregue</SelectItem>
              <SelectItem value={StatusPedido.RECUSADO}>Recusado</SelectItem>
              <SelectItem value={StatusPedido.CANCELADO}>Cancelado</SelectItem>
              <SelectItem value={StatusPedido.FALHA_PAGAMENTO}>Falha Pag.</SelectItem>
            </SelectContent>
          </Select>
          <Button onClick={carregarPedidos}>Atualizar</Button>
        </div>
      </div>

      {erro && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {erro}
        </div>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Lista de Pedidos</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Cliente</TableHead>
                <TableHead>Telefone</TableHead>
                <TableHead>Data</TableHead>
                <TableHead>Valor</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {pedidosFiltrados.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-4">
                    Nenhum pedido encontrado {filtroStatus !== 'todos' ? `com status ${filtroStatus}` : ''}
                  </TableCell>
                </TableRow>
              ) : (
                pedidosFiltrados.map((pedido: Pedido) => (
                  <TableRow key={pedido.id}>
                    <TableCell>#{pedido.id ?? "N/A"}</TableCell>
                    <TableCell>{pedido.nome_cliente}</TableCell>
                    <TableCell>{pedido.telefone}</TableCell>
                    <TableCell>{formatarData(pedido.data_criacao)}</TableCell>
                    <TableCell>{formatarPreco(pedido.valor_total ?? 0)}</TableCell>
                    <TableCell>
                      <Badge className={getStatusBadgeColor(pedido.status)}>
                        {pedido.status ?? "Desconhecido"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-col gap-1 items-start">
                        <Select
                          value={pedido.status ?? ""}
                          onValueChange={(value) => {
                            if (pedido.id !== undefined) {
                                atualizarStatus(pedido.id, value)
                            }
                          }}
                          disabled={!pedido.id || [StatusPedido.ENTREGUE, StatusPedido.CANCELADO, StatusPedido.RECUSADO, StatusPedido.FALHA_PAGAMENTO].includes(pedido.status ?? "")}
                        >
                          <SelectTrigger className="w-[180px]">
                            <SelectValue placeholder="Alterar status" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value={StatusPedido.PENDENTE}>Pendente</SelectItem>
                            <SelectItem value={StatusPedido.APROVADO}>Aprovar</SelectItem>
                            <SelectItem value={StatusPedido.RECUSADO}>Recusar</SelectItem>
                            <SelectItem value={StatusPedido.EM_PREPARACAO}>Em Preparação</SelectItem>
                            <SelectItem value={StatusPedido.A_CAMINHO}>A Caminho</SelectItem>
                            <SelectItem value={StatusPedido.PRONTO_RETIRADA}>Pronto Retirada</SelectItem>
                            <SelectItem value={StatusPedido.ENTREGUE}>Entregue</SelectItem>
                            <SelectItem value={StatusPedido.CANCELADO}>Cancelar</SelectItem>
                          </SelectContent>
                        </Select>
                        <Button
                          variant="link"
                          className="p-0 h-auto text-xs mt-1"
                          onClick={() => {
                            const itensStr = pedido.itens ? JSON.stringify(pedido.itens.map(i => ({ Esfiha: i.esfiha, Qtd: i.quantidade, Obs: i.observacoes })), null, 2) : "Nenhum item encontrado";
                            alert(`Detalhes do Pedido #${pedido.id ?? "N/A"}:\n\n${itensStr}`);
                          }}
                          disabled={!pedido.id}
                        >
                          Ver detalhes
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}

