from starlette.testclient import TestClient
from fastapi import FastAPI, Response

app = FastAPI()


@app.post('/test')
def test(response: Response):
    response.set_cookie('token', 'test_value', httponly=True)
    return {'ok': True}


client = TestClient(app)
r = client.post('/test')
print('Cookies:', r.cookies)
print('Set-Cookie header:', r.headers.get('set-cookie'))
