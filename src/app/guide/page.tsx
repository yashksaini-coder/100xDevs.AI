import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { Construction} from "lucide-react";

export default function Guide() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-purple-500/10 backdrop-blur-sm" />
      <Card className="relative z-10 w-full max-w-2xl bg-background/80 backdrop-blur-sm border-0 shadow-xl">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <div className="p-3 bg-blue-100 rounded-full">
              <Construction className="w-8 h-8 text-blue-600" />
            </div>
          </div>
          <CardTitle className="text-3xl font-bold text-foreground">
            Under Construction
          </CardTitle>
        </CardHeader>
      </Card>
    </div>
  );
}
