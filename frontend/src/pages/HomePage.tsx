import { Button } from "@/components/ui/button";

export default function HomePage() {
  return (
    <div className="space-y-4">
      <h1 className="text-3xl font-bold">Welcome to Betomeshi</h1>
      <p className="text-muted-foreground">
        This is a sample page using Shadcn UI components.
      </p>
      <div className="flex gap-2">
        <Button>Toi dong tinh</Button>
        <Button variant="destructive">Toi khong dong tinh</Button>
      </div>
    </div>
  );
}
