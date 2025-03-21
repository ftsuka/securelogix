
import React from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search } from 'lucide-react';

interface CredentialLeaksSearchProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
}

const CredentialLeaksSearch: React.FC<CredentialLeaksSearchProps> = ({
  searchQuery,
  onSearchChange
}) => {
  return (
    <div className="flex w-full max-w-sm items-center space-x-2">
      <Input
        placeholder="Buscar por email, username, senha parcial..."
        value={searchQuery}
        onChange={e => onSearchChange(e.target.value)}
        className="flex-1"
      />
      <Button variant="outline" size="icon">
        <Search className="h-4 w-4" />
      </Button>
    </div>
  );
};

export default CredentialLeaksSearch;
