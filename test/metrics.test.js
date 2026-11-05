const request = require("supertest");

jest.mock("../src/services/taskService");

const service = require("../src/services/taskService");
const app = require("../src/app");

describe("Observabilidade", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("GET /health deve retornar status ok", async () => {
    const response = await request(app).get("/health");

    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual({ status: "ok" });
  });

  test("GET /metrics deve expor as métricas no formato Prometheus", async () => {
    const response = await request(app).get("/metrics");

    expect(response.statusCode).toBe(200);
    expect(response.headers["content-type"]).toContain("text/plain");
    expect(response.text).toContain("# HELP http_requests_total");
    expect(response.text).toContain("# TYPE http_request_duration_seconds histogram");
  });

  test("uma requisição deve incrementar o contador com o padrão da rota", async () => {
    service.getTask.mockResolvedValue({
      id: 1,
      title: "Estudar Node.js",
      completed: false,
      isDeleted: false
    });

    await request(app).get("/tasks/1");

    const response = await request(app).get("/metrics");

    expect(response.text).toContain(
      'http_requests_total{method="GET",route="/tasks/:id",status_code="200"} 1'
    );
  });

  test("rota inexistente deve ser agrupada como unmatched", async () => {
    await request(app).get("/rota-que-nao-existe");

    const response = await request(app).get("/metrics");

    expect(response.text).toContain(
      'http_requests_total{method="GET",route="unmatched",status_code="404"} 1'
    );
  });
});
