/**
 * Indicador discreto "Ao vivo" — bolinha vermelha piscando + rótulo,
 * sinalizando que o painel reflete os dados em tempo real.
 */
export function LiveIndicator() {
  return (
    <span
      className="inline-flex items-center gap-1.5"
      title="Painel atualizado em tempo real"
    >
      <span className="relative flex h-2 w-2">
        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-500 opacity-75" />
        <span className="relative inline-flex h-2 w-2 rounded-full bg-red-500" />
      </span>
      <span className="text-xs font-medium text-muted-foreground">Ao vivo</span>
    </span>
  );
}
