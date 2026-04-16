import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import request from 'supertest';
import type { Server } from 'http';
import app from '../../src/app';

let server: Server;

beforeAll(() => {
  server = app.listen(0); // port aléatoire pour éviter les conflits
});

afterAll(() => {
  server.close();
});

const profilValide = {
  sexe: 'homme',
  age: 30,
  taille: 175,
  poids: 80,
  niveau_activite: 'moderement_actif',
  objectif: 'perte_poids',
};

describe('GET /api/v1/health', () => {
  it('retourne 200 avec status ok', async () => {
    const res = await request(server).get('/api/v1/health');
    expect(res.status).toBe(200);
    expect(res.body.status).toBe('ok');
    expect(res.body.version).toBeDefined();
  });
});

describe('POST /api/v1/nutrition/validate', () => {
  it('retourne 200 pour un profil valide', async () => {
    const res = await request(server)
      .post('/api/v1/nutrition/validate')
      .send(profilValide);
    expect(res.status).toBe(200);
    expect(res.body.status).toBe('success');
  });

  it('retourne 400 pour un profil vide', async () => {
    const res = await request(server)
      .post('/api/v1/nutrition/validate')
      .send({});
    expect(res.status).toBe(400);
    expect(res.body.status).toBe('error');
    expect(res.body.code).toBe('VALIDATION_ERROR');
    expect(res.body.errors).toBeInstanceOf(Array);
  });

  it('retourne les champs en erreur dans errors[]', async () => {
    const res = await request(server)
      .post('/api/v1/nutrition/validate')
      .send({ ...profilValide, age: 5 });
    expect(res.status).toBe(400);
    const champs = res.body.errors.map((e: { field: string }) => e.field);
    expect(champs).toContain('age');
  });
});

describe('POST /api/v1/nutrition/analyze', () => {
  it('retourne 200 avec un rapport complet', async () => {
    const res = await request(server)
      .post('/api/v1/nutrition/analyze')
      .send(profilValide);

    expect(res.status).toBe(200);
    expect(res.body.status).toBe('success');

    const { data } = res.body;
    expect(data.profil.imc.valeur).toBeGreaterThan(0);
    expect(data.profil.bmr.valeur).toBeGreaterThan(0);
    expect(data.profil.tdee.valeur).toBeGreaterThan(0);
    expect(data.calories_cibles.valeur).toBeGreaterThan(0);
    expect(data.macronutriments.proteines.valeur).toBeGreaterThan(0);
    expect(data.macronutriments.lipides.valeur).toBeGreaterThan(0);
    expect(data.macronutriments.glucides.valeur).toBeGreaterThanOrEqual(0);
  });

  it('inclut le disclaimer dans la réponse', async () => {
    const res = await request(server)
      .post('/api/v1/nutrition/analyze')
      .send(profilValide);
    expect(res.body.disclaimer).toBeTruthy();
  });

  it('retourne 400 pour un profil invalide', async () => {
    const res = await request(server)
      .post('/api/v1/nutrition/analyze')
      .send({ sexe: 'robot', age: -5 });
    expect(res.status).toBe(400);
    expect(res.body.code).toBe('VALIDATION_ERROR');
  });

  it('le TDEE est supérieur au BMR', async () => {
    const res = await request(server)
      .post('/api/v1/nutrition/analyze')
      .send(profilValide);
    const { bmr, tdee } = res.body.data.profil;
    expect(tdee.valeur).toBeGreaterThan(bmr.valeur);
  });

  it('fonctionne pour une femme avec objectif maintien', async () => {
    const res = await request(server)
      .post('/api/v1/nutrition/analyze')
      .send({
        sexe: 'femme',
        age: 25,
        taille: 165,
        poids: 58,
        niveau_activite: 'legerement_actif',
        objectif: 'maintien',
      });
    expect(res.status).toBe(200);
    expect(res.body.data.calories_cibles.ajustement).toBe(0);
  });

  it('applique le minimum de sécurité calorique si nécessaire', async () => {
    const res = await request(server)
      .post('/api/v1/nutrition/analyze')
      .send({
        sexe: 'femme',
        age: 40,
        taille: 155,
        poids: 45,
        niveau_activite: 'sedentaire',
        objectif: 'perte_poids',
      });
    expect(res.status).toBe(200);
    expect(res.body.data.calories_cibles.valeur).toBeGreaterThanOrEqual(1200);
  });
});
