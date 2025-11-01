import React from 'react';

interface PaginationProps {
  total: number;
  currentPage: number;
  onPageChange?: (page: number) => void;
}

export default function Pagination({ total, currentPage, onPageChange }: PaginationProps) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mt-2 gap-4">
      <span className="text-textSecondary text-sm">Mostrando 1 a {total} de 50 resultados</span>
      <div className="flex items-center gap-4">
        <button className="px-4 py-2 bg-surface rounded hover:bg-hoverButton text-textPrimary">Anterior</button>
        <div className="flex items-center gap-2 text-textPrimary">
          <button className="px-3 py-1 rounded bg-primary font-bold text-background">1</button>
          <button className="px-3 py-1 rounded hover:bg-hoverButton">2</button>
          <span>...</span>
          <button className="px-3 py-1 rounded hover:bg-hoverButton">3</button>
          <button className="px-3 py-1 rounded hover:bg-hoverButton">5</button>
        </div>
        <button className="px-4 py-2 bg-surface rounded hover:bg-hoverButton text-textPrimary">Próximo &gt;</button>
      </div>
    </div>
  );
} 