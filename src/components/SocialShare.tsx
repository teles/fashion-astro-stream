
import React from "react";
import { Twitter, Facebook, Linkedin, Link } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";

interface SocialShareProps {
  url: string;
  title: string;
  className?: string;
}

const SocialShare = ({ url, title, className }: SocialShareProps) => {
  const { toast } = useToast();
  const encodedUrl = encodeURIComponent(url);
  const encodedTitle = encodeURIComponent(title);

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(url);
      toast({
        title: "Link copiado!",
        description: "O link foi copiado para a área de transferência.",
      });
    } catch (error) {
      toast({
        title: "Erro ao copiar link",
        description: "Não foi possível copiar o link. Tente novamente.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className={cn("flex items-center gap-2", className)}>
      <span className="text-sm text-fashion-secondary mr-1">Compartilhar:</span>
      
      <Button
        size="sm"
        variant="outline"
        className="rounded-full w-8 h-8 p-0"
        onClick={() => window.open(`https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`, "_blank")}
        aria-label="Compartilhar no Twitter"
      >
        <Twitter className="h-4 w-4" />
        <span className="sr-only">Compartilhar no Twitter</span>
      </Button>
      
      <Button
        size="sm"
        variant="outline"
        className="rounded-full w-8 h-8 p-0"
        onClick={() => window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`, "_blank")}
        aria-label="Compartilhar no Facebook"
      >
        <Facebook className="h-4 w-4" />
        <span className="sr-only">Compartilhar no Facebook</span>
      </Button>
      
      <Button
        size="sm"
        variant="outline"
        className="rounded-full w-8 h-8 p-0"
        onClick={() => window.open(`https://www.linkedin.com/shareArticle?mini=true&url=${encodedUrl}&title=${encodedTitle}`, "_blank")}
        aria-label="Compartilhar no LinkedIn"
      >
        <Linkedin className="h-4 w-4" />
        <span className="sr-only">Compartilhar no LinkedIn</span>
      </Button>
      
      <Button
        size="sm"
        variant="outline"
        className="rounded-full w-8 h-8 p-0"
        onClick={handleCopyLink}
        aria-label="Copiar link"
      >
        <Link className="h-4 w-4" />
        <span className="sr-only">Copiar link</span>
      </Button>
    </div>
  );
};

export default SocialShare;
