export async function GET(req, res) {
  try {



    return new Response('Hellow', {
      status: 200,
      headers: {
        // "Content-Type": "application/pdf",
        // "Content-Disposition": 'inline; filename="Recibo Digital.pdf"',
        "Content-Type": "text/html",
      },
    });
  } catch (error) {
    console.log(error);
  }
}