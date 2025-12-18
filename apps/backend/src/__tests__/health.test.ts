import { describe, expect, it } from "bun:test";
import app from "..";

describe('HEALTH', () =>{
    it('health-request-test', async () =>{
       
        const response = await app
            .handle(new Request('http://localhost/health'))
            .then((res) => res.text())

        expect(response).toBe('Working fine')
    });
})