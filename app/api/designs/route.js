import { designs } from "@/app/data/designs";

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const category = searchParams.get("category");
  const recommendedDesigns = category
    ? designs.filter((design) => design.categories.includes(category))
    : designs;

  return Response.json(
    recommendedDesigns.sort(
      (firstDesign, secondDesign) => firstDesign.priority - secondDesign.priority
    )
  );
}
