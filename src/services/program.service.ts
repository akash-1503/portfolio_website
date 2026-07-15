export async function getPrograms() {
  const res = await fetch("/api/admin/programs");

  if (!res.ok) {
    throw new Error("Failed to fetch programs");
  }

  return res.json();
}

export async function createProgram(data: any) {
  const res = await fetch("/api/admin/programs", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  return res.json();
}

export async function updateProgram(data: any) {

  const res = await fetch("/api/admin/programs", {

    method: "PATCH",

    headers: {
      "Content-Type": "application/json",
    },

    body: JSON.stringify(data),

  });

  return res.json();

}

export async function deleteProgram(id: string) {
  const res = await fetch(`/api/admin/programs?id=${id}`, {
    method: "DELETE",
  });

  return res.json();
}