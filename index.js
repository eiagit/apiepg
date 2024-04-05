import express from "express";
import cors from "cors";
import {Execsql} from "./database.js"
const app = express();
app.use(express.json());
app.use(cors());

app.listen(3000,()=>{
    console.log('Servidor no ar na porta 3000 ')
});
app.get("/",(req,res)=>{
    const params=[];
    res.status(200).json({"Mensagem":"Servidor Respondendo na rota "})
})
app.get("/tabelas/tipousuario", async (req, res) => {
    try {
        const results = await Execsql`
          SELECT * FROM "JTIU"`
        res.status(200).json(results)
    } catch (err) {
        res.status(500).json({ 'error': err })
    }
})
app.get("/tipo", async (req,res)=>{
    try {
        const results = await Execsql`SELECT * From "JTIP" 
        ORDER BY "TIP_ID"`
        res.status(200).json(results)
    } catch (err) {
        res.status(500).json({ 'error': err })
    }
})
app.get("/status",async (req,res)=>{
    try {
        const results = await Execsql`SELECT * From "JSTA"
         ORDER BY "STA_ID"`
        res.status(200).json(results)
    } catch (err) {
        res.status(500).json({ 'error': err })
    }    

})
app.get("/colaborador/todos",async (req,res)=>{
    try {
        const results = await Execsql`SELECT "JUSO".*,"TIU_NOME","STA_NOME" AS "USO_STANOM"
         From "JUSO"
         LEFT JOIN "JTIU" ON "TIU_ID"="USO_TIPO"
         LEFT JOIN "JSTA" ON "STA_ID"="USO_STATUS"
         where "USO_TIPO"=1`
        res.status(200).json(results)
    } catch (err) {
        res.status(500).json({ 'error': err })
    }    
})
app.get("/colaborador/contatos",async(req,res)=>{
    try {
        const results = await Execsql`SELECT "JUSO".*,"TIU_NOME" ,"STA_NOME" AS "USO_STANOM"
        From "JUSO" 
        LEFT JOIN "JTIU" ON "TIU_ID"="USO_TIPO"
        LEFT JOIN "JSTA" ON "STA_ID"="USO_STATUS"
        where "USO_TIPO"= 3`
        res.status(200).json(results)
    } catch (err) {
        res.status(500).json({ 'error': err })
    } 
})
app.get("/colaborador/contatos",async(req,res)=>{
    try {
        const results = await Execsql`SELECT "JUSO".*,"TIU_NOME"
        ,"STA_NOME" AS "USO_STANOM"
        ,"USO_FOTO"
        From "JUSO" 
        LEFT JOIN "JTIU" ON "TIU_ID"="USO_TIPO"
        LEFT JOIN "JSTA" ON "STA_ID"="USO_STATUS"
        ORDER BY "USO_NOME"`
        res.status(200).json(results)
    } catch (err) {
        res.status(500).json({ 'error': err })
    } 
})
app.get("/usuario/todos",async(req,res)=>{
    try {
        const results = await Execsql`SELECT "JUSO".*,"TIU_NOME"
        ,"STA_NOME" AS "USO_STANOM"
        ,"USO_FOTO"
        From "JUSO" 
        LEFT JOIN "JTIU" ON "TIU_ID"="USO_TIPO"
        LEFT JOIN "JSTA" ON "STA_ID"="USO_STATUS"
        ORDER BY "USO_NOME"`
        res.status(200).json(results)
    } catch (err) {
        res.status(500).json({ 'error': err })
    }     
})
app.get("/usuario/filtranome",async(req,res)=>{
    try {
        const results = await Execsql`SELECT "JUSO".*,"TIU_NOME"
        ,"STA_NOME" AS "USO_STANOM"
        ,"USO_FOTO"
        From "JUSO"
        LEFT JOIN "JTIU" ON "TIU_ID"="USO_TIPO"
        WHERE "USO_NOME" LIKE ${"'"+req.query.USO_NOME+"'"}%'
        ORDER BY "USO_NOME"`
        res.status(200).json(results)
    } catch (err) {
        res.status(500).json({ 'error': err })
    }
})
app.get("/usuario/pesquisa",async(req,res)=>{
    try {
        const results = await Execsql  `SELECT "JUSO".*,"TIU_NOME"
        ,"STA_NOME" AS "USO_STANOM"
        ,"USO_FOTO"
        From "JUSO"
        LEFT JOIN "JTIU" ON "TIU_ID"="USO_TIPO"
        LEFT JOIN "JSTA" ON "STA_ID"="USO_STATUS"
        WHERE UPPER( ${ Execsql(req.query.USO_CAMPO) } ) LIKE
        ${ '%' + req.query.USO_NOME +  '%' }
        ORDER BY "USO_NOME"`
        res.status(200).json(results)
    } catch (err) {
        res.status(500).json({ 'error': err })
    }         
})
app.get("/usuario/login",async(req,res)=>{
    try {
        const results = await Execsql`SELECT "JUSO".*,"TIU_NOME"
        ,"STA_NOME" AS "USO_STANOM"
        ,"USO_FOTO"
        From "JUSO"
        LEFT JOIN "JTIU" ON "TIU_ID"="USO_TIPO"
        LEFT JOIN "JSTA" ON "STA_ID"="USO_STATUS"
        WHERE "USO_LOGIN" = ${req.query.LOG_USER} AND "USO_PASSWO" = ${req.query.LOG_PASSWO}
        ORDER BY "USO_NOME"
        LIMIT 1
        `
        res.status(200).json(results)
    } catch (err) {
        res.status(500).json({ 'error': err })
    }         
})
app.get("/usuario/email",async(req,res)=>{
    try {
        const results = await Execsql`SELECT "JUSO".*,"TIU_NOME"
        ,"STA_NOME" AS "USO_STANOM"
        ,"USO_FOTO"
        From "JUSO"
        LEFT JOIN "JTIU" ON "TIU_ID"="USO_TIPO"
        LEFT JOIN "JSTA" ON "STA_ID"="USO_STATUS"
        WHERE "USO_LOGIN" = ${req.query.LOG_USER} AND COALESCE("USO_PASSWO",'0') = '0'
        ORDER BY "USO_NOME"`
        res.status(200).json(results)
    } catch (err) {
        res.status(500).json({ 'error': err })
    }             
})
app.put("/usuario/password",async(req,res)=>{
    try {

        const results = await Execsql`UPDATE "JUSO" SET "USO_PASSWO" = ${req.body.LOG_PASSWO} 
        WHERE "USO_ID" = ${req.body.LOG_ID}`
        res.status(201).json(results)
    } catch (err) {
        res.status(500).json({ 'error': err })
    }             
})
app.put("/usuario/status",async(req,res)=>{
    try {

        const results = await Execsql`UPDATE "JUSO" SET "USO_STATUS"= CASE WHEN ${req.body.USO_STATUS} = 0 THEN 1 ELSE 0  END
        WHERE "USO_ID" = ${req.body.USO_ID}`
        res.status(201).json({"USO_ID":req.body.USO_ID})
    } catch (err) {
        res.status(500).json({ 'error': err })
    }           
})
app.post("/colaborador",async(req,res)=>{
    try {
        const results = await Execsql`INSERT INTO "JUSO" ("USO_ID","USO_NOME","USO_STATUS","USO_TIPO","USO_FOTO","USO_LOGIN","USO_PASSWO")
        VALUES (DEFAULT,${req.body.USO_NOME},${req.body.USO_STATUS},${req.body.USO_TIPO},${req.body.USO_FOTO},${req.body.USO_LOGIN},${req.body.USO_PASSWO}) 
        RETURNING "USO_ID";`
        res.status(201).json(results)
    } catch (err) {
        res.status(500).json({ 'error': err })
    }       
})
app.get("/telefone",async(req,res)=>{
    try {
        const results = await Execsql`SELECT * From "JTEL" 
        WHERE "TEL_USUARI" = ${req.query.TEL_USUARI}`
          res.status(200).json(results)
    } catch (err) {
        res.status(500).json({ 'error': err })
    }       
})
app.post("/telefone",async(req,res)=>{
    try {
       const results = await Execsql`INSERT INTO "JTEL" ("TEL_ID","TEL_USUARI","TEL_TELEFO","TEL_DDD") 
       VALUES 
       (DEFAULT,${req.body.TEL_USUARI},${req.body.TEL_TELEFO},${req.body.TEL_DDD}) RETURNING "TEL_ID";`
       res.status(201).json(results)
    } catch (err) {
        res.status(500).json({ 'error': err })
    } 
})
app.delete("/telefone/apagaum",async(req,res)=>{
    try {
        const results = await Execsql`DELETE FROM "JTEL" WHERE "TEL_USUARI" = ${ req.body.TEL_USUARI } AND "TEL_TELEFO" = ${ req.body.TEL_TELEFO }`
      res.status(204).json({"TEL_USUARI": req.body.TEL_USUARI})
    } catch (err) {
      res.status(500).json({ 'error': err })
    }
  })
app.delete("/telefone/apagatodos",async(req,res)=>{
    try {
        const results = await Execsql`DELETE FROM "JTEL" WHERE "TEL_USUARI" = ${ req.body.TEL_USUARI }`
        res.status(204).json({"TEL_USUARI" : req.body.TEL_USUARI})
    } catch (err) {
      res.status(500).json({ 'error': err })
    } 
})
app.put("/colaborador", async (req, res) => {
    try {
        const results = await Execsql`UPDATE "JUSO" SET 
        "USO_NOME"      = ${req.body.USO_NOME}
        ,"USO_STATUS"   = ${req.body.USO_STATUS} 
        ,"USO_TIPO"     = ${req.body.USO_TIPO}
        ,"USO_FOTO"     = ${req.body.USO_FOTO}
        ,"USO_LOGIN"    = ${req.body.USO_LOGIN}
        ,"USO_PASSWO"   = ${req.body.USO_PASSWO}
        WHERE "USO_ID"  = ${req.body.USO_ID}`
        res.status(201).json(results)
    } catch (err) {
        res.status(500).json({ 'error': err })
    }

})
app.delete("/colaborador",async(req,res)=>{
    try {
        const results = await Execsql`DELETE FROM "JUSO" WHERE "USO_ID" = ${ req.body.USO_ID } `
        res.status(202).json(req.body)
    } catch (err) {
        res.status(500).json({ 'error': err })
    }
})
app.get("/fornecedor/todos",async(req,res)=>{
    try {
        const results = await Execsql`SELECT "JFOR".*
         ,"STA_NOME" AS "FOR_STANOM"
         ,"FOR_FOTO" 
         From "JFOR" 
         LEFT JOIN "JSTA" ON "STA_ID"="FOR_STATUS"
         ORDER BY "FOR_NOME" `
        res.status(201).json(results)
    } catch (err) {
        res.status(500).json({ 'error': err })
    }  
})
app.get("/fornecedor",async(req,res)=>{
    try {
        const results = await Execsql`SELECT "JFOR".*
        ,"STA_NOME" AS "FOR_STANOM"
        ,"FOR_FOTO", "STA_NOME"
         FROM "JFOR" 
         LEFT JOIN "JSTA" ON "STA_ID" = "FOR_STATUS"
         WHERE "FOR_ID" = ${ '%'+req.query.FOR_DADOS+'%' } 
         ORDER BY "FOR_NOME"
         LIMIT 1`
        res.status(200).json(results)
    } catch (err) {
        res.status(500).json({ 'error': err })
    } 
})
app.get("/fornecedor/pesquisa",async(req,res)=>{
    try {
        const results = await Execsql`SELECT "JFOR".*
        ,"STA_NOME" AS "FOR_STANOM"
        ,"FOR_FOTO", "STA_NOME"
         FROM "JFOR" 
         LEFT JOIN "JSTA" ON "STA_ID" = "FOR_STATUS"
         WHERE UPPER( ${ Execsql( req.query.FOR_CAMPO ) })  LIKE UPPER( ${ '%'+req.query.FOR_DADOS+'%' } )
         ORDER BY "FOR_NOME"
         LIMIT 1`
        res.status(200).json(results)
    } catch (err) {
        res.status(500).json({ 'error': err })
    } 
})
app.get("/fornecedor/contatos",async(req,res)=>{
    try {
        const results = await Execsql`SELECT "JUSO".*,"TIU_NOME"
        ,"STA_NOME" AS "FOR_STANOM"
        ,"USO_FOTO"
        ,"FCO_ID","FCO_FORNEC","FCO_CONTAT"
        From "JFCO" 
        LEFT JOIN "JUSO" ON "USO_ID" = "FCO_CONTAT"
        LEFT JOIN "JTIU" ON "TIU_ID" = "USO_TIPO"
        LEFT JOIN "JSTA" ON "STA_ID"="USO_STATUS"
        WHERE "FCO_FORNEC" = ${req.query.FCO_FORNEC}
        ORDER BY "USO_NOME"`
        res.status(201).json(results)
    } catch (err) {
        res.status(500).json({ 'error': err })
    }  
})
app.post("/fornecedor",async(req,res)=>{
    const params={
    FOR_NOME:req.body.FOR_NOME,
    FOR_RAZAO:req.body.FOR_RAZAO,
    FOR_CNPJ:req.body.FOR_CNPJ,
    FOR_STATUS:req.body.FOR_STATUS,
    FOR_FOTO:req.body.FOR_FOTO
    }
    try {
         const results = await Execsql`INSERT INTO "JFOR" ${ Execsql(params) }
         RETURNING "FOR_ID"`

        res.status(201).json(results)
    } catch (err) {
        res.status(500).json({ 'error': err })
    }
})
app.put("/fornecedor", async (req, res) => {
    const params = {
    "FOR_NOME":req.body.FOR_NOME,
    "FOR_RAZAO":req.body.FOR_RAZAO,
    "FOR_CNPJ":req.body.FOR_CNPJ,
    "FOR_STATUS":req.body.FOR_STATUS,
    "FOR_FOTO":req.body.FOR_FOTO}
    try {
        const results = await Execsql`UPDATE "JFOR" SET ${Execsql(params)}
        WHERE "FOR_ID" = ${req.body.FOR_ID} RETURNING "FOR_ID"`
        res.status(201).json(results)        
    } catch (err) {
        res.status(500).json({ 'error': err })
    }
})
app.delete("/fornecedor",async(req,res)=>{
    try {
        const results = await Execsql`DELETE FROM "JFOR"
        WHERE "FOR_ID" = ${req.body.FOR_ID} RETURNING "FOR_ID"`
        res.status(201).json(results)        
    } catch (err) {
        res.status(500).json({ 'error': err })
    }
})
app.put("/fornecedor/status",async(req,res)=>{
    try {
        const results = await Execsql`UPDATE "JFOR" SET "FOR_STATUS" = CASE WHEN ${req.body.FOR_STATUS} = 0 THEN 1 ELSE 0  END
        WHERE "FOR_ID" = ${req.body.FOR_ID}`
        res.status(201).json(results)        
    } catch (err) {
        res.status(500).json({ 'error': err })
    }  
})
app.post("/fornecedor/contato",async(req,res)=>{
    const params={
    "FCO_FORNEC":req.body.FCO_FORNEC,
    "FCO_CONTAT":req.body.FCO_CONTAT}
    try {
        const results = await Execsql`INSERT INTO "JFCO" ${ Execsql( params ) }`
        res.status(201).json(results)        
    } catch (err) {
        res.status(500).json({ 'error': err })
    }    
})
app.delete("/fornecedor/contato",async(req,res)=>{
    try {
        const results = await Execsql`DELETE FROM "JFCO" WHERE "FCO_ID" = ${ req.body.FCO_ID }`
        res.status(201).json(results)        
    } catch (err) {
        res.status(500).json({ 'error': err })
    }    
})
app.delete("/fornecedor/contatoapagatodos",async(req,res)=>{
    try {
        const results = await Execsql`DELETE FROM "JFCO" WHERE "FCO_FORNEC" = ${req.body.FOR_ID}`
        res.status(201).json(results)        
    } catch (err) {
        res.status(500).json({ 'error': err })
    } 
})
app.get("/produtos",async(req,res)=>{
    try {
        const results = await Execsql`SELECT "JPRO".*
        ,"STA_NOME","TIP_NOME","FOR_NOME"
         From "JPRO" 
         LEFT JOIN "JSTA" ON "STA_ID"="PRO_STATUS"
         LEFT JOIN "JTIP" ON "TIP_ID"="PRO_TIPO"
         LEFT JOIN "JFOR" ON "FOR_ID"="PRO_FORNEC"
         ORDER BY "PRO_NOME" `
        res.status(200).json(results)        
    } catch (err) {
        res.status(500).json({ 'error': err })
    }   
})
app.get("/produto/id",async(req,res)=>{
    try {
        const results = await Execsql`SELECT "JPRO".*
        ,"STA_NOME","TIP_NOME","FOR_NOME"
        From "JPRO" 
        LEFT JOIN "JSTA" ON "STA_ID"="PRO_STATUS"
        LEFT JOIN "JTIP" ON "TIP_ID"="PRO_TIPO"
        LEFT JOIN "JFOR" ON "FOR_ID"="PRO_FORNEC"
        WHERE "PRO_ID" =  ${ req.query.PRO_ID }
        ORDER BY "PRO_ID"
       LIMIT 1`
        res.status(201).json(results)        
    } catch (err) {
        res.status(500).json({ 'error': err })
    }    
})
app.get("/produto/pesquisa",async(req,res)=>{
    try {
        const results = await Execsql`SELECT "JPRO".*
        ,"STA_NOME","TIP_NOME","FOR_NOME"
        From "JPRO" 
        LEFT JOIN "JSTA" ON "STA_ID"="PRO_STATUS"
        LEFT JOIN "JTIP" ON "TIP_ID"="PRO_TIPO"
        LEFT JOIN "JFOR" ON "FOR_ID"="PRO_FORNEC"
        WHERE UPPER( ${ Execsql( req.query.PES_CAMPO ) } ) = UPPER( ${ req.query.PES_NOME } )
        ORDER BY "PRO_ID"
       LIMIT 1`
        res.status(201).json(results)        
    } catch (err) {
        res.status(500).json({ 'error': err })
    }    
})
app.post("/produtos",async(req,res)=>{
    const params={
    PRO_NOME:req.body.PRO_NOME,
    PRO_BARRAS:req.body.PRO_BARRAS,
    PRO_PRECO:req.body.PRO_PRECO,    
    PRO_TIPO:req.body.PRO_TIPO,
    PRO_STATUS:req.body.PRO_STATUS,
    PRO_FORNEC:req.body.PRO_FORNEC}
    try {
        const results = await Execsql`INSERT INTO "JPRO" ${ Execsql( params ) }`
        res.status(201).json(results)        
    } catch (err) {
        res.status(500).json({ 'error': err })
    } 
})
app.put("/produtos",async(req,res)=>{
    const params={
        PRO_NOME:req.body.PRO_NOME,
        PRO_BARRAS:req.body.PRO_BARRAS,
        PRO_PRECO:req.body.PRO_PRECO,    
        PRO_TIPO:req.body.PRO_TIPO,
        PRO_STATUS:req.body.PRO_STATUS,
        PRO_FORNEC:req.body.PRO_FORNEC}
        try {
            const results = await Execsql`UPDATE "JPRO" SET ${ Execsql( params ) } WHERE "PRO_ID" = ${req.body.PRO_ID}`
            res.status(201).json(results)        
        } catch (err) {
            res.status(500).json({ 'error': err })
        }   
})
app.put("/produtos/status",async(req,res)=>{
    try {
        const results = await Execsql`UPDATE "JPRO" SET "PRO_STATUS" = CASE WHEN ${req.body.PRO_STATUS} = 0 THEN 1 ELSE 0 END
        WHERE "PRO_ID" = ${req.body.PRO_ID}`
        res.status(201).json(results)        
    } catch (err) {
        res.status(500).json({ 'error': err })
    }    
})
app.post("/produtos/movimento",async(req,res)=>{
    const params={
    MOV_USUARI:req.body.MOV_USUARI ,
    MOV_DATA:req.body.MOV_DATA ,   
    MOV_VALOR:req.body.MOV_VALOR ,
    MOV_QUANTI:req.body.MOV_QUANTI ,
    MOV_PRODUT:req.body.MOV_PRODUT,
    MOV_VCNID:req.body.MOV_VCNID}
    try {
        const results = await Execsql`INSERT INTO "JMOV" ${ Execsql( params ) } RETURNING "MOV_ID"`
        res.status(201).json(results)        
    } catch (err) {
        res.status(500).json({ 'error': err })
    }    
})
app.put("/produtos/estoque",async(req,res)=>{

    try {
        const results = await Execsql`UPDATE "JPRO" SET "PRO_ESTOQU" = "PRO_ESTOQU" + CASE WHEN  ${req.body.MOV_TIPO} = 0  THEN ${req.body.MOV_QUANTI} ELSE ${req.body.MOV_QUANTI} *(-1)  END
        WHERE "PRO_ID" = ${ req.body.PRO_ID }`
        res.status(201).json(results)        
    } catch (err) {
        res.status(500).json({ 'error': err })
    }    
})
app.get("/venda/caixa",async(req,res)=>{
    try {
        const results = await Execsql`SELECT "PAG_NOME" , SUM("VCN_VALOR"+"VCN_ACRESC"-"VCN_DESCON") "VCN_VALOR" FROM "JVCN"
        LEFT JOIN "JPAG" ON "PAG_ID"="VCN_PAGTO"
        WHERE "VCN_DATA" = CURRENT_DATE
        GROUP BY 1`
        res.status(201).json(results)        
    } catch (err) {
        res.status(500).json({ 'error': err })
    }    
})
app.get("/venda/vendas",async(req,res)=>{
        try {
        const results = await Execsql`SELECT "VCN_ID","VCN_DATA","VCN_TIME","VCN_VALOR","VCN_PDV","VCN_DESCON","VCN_ACRESC","PAG_NOME","VCN_VALOR"+"VCN_ACRESC"-"VCN_DESCON" "VCN_VENDA","USO_NOME" FROM "JVCN"
         LEFT JOIN "JPAG" ON "PAG_ID"="VCN_PAGTO"
         LEFT JOIN "JUSO" ON "USO_ID"="VCN_USUARI"
         WHERE "VCN_DATA" = CURRENT_DATE`
         res.status(201).json(results)        
        } catch (err) {
            res.status(500).json({ 'error': err })
        }    
})
app.get("/venda/produtos",async(req,res)=>{
    try {
        const results = await Execsql`SELECT "PRO_ID","PRO_NOME",SUM("MOV_QUANTI") "MOV_QUANTI",AVG("MOV_VALOR") "MOV_VALOR",SUM("MOV_QUANTI"*"MOV_VALOR") "MOV_TOTAL"
                     FROM "JVCN"
                     LEFT JOIN "JMOV" ON "MOV_VCNID"="VCN_ID"
                     LEFT JOIN "JPRO" ON "PRO_ID"="MOV_PRODUT"
                     WHERE "VCN_DATA" = CURRENT_DATE
                     GROUP BY 1,2
                    `
        res.status(201).json(results)
    } catch (err) {
        res.status(500).json({ 'error': err })
    }
})
app.post("/venda",async(req,res)=>{
    const params={
    VCN_DATA:req.body.VCN_DATA,
    VCN_TIME:req.body.VCN_TIME,
    VCN_VALOR:req.body.VCN_VALOR,    
    VCN_PAGTO:req.body.VCN_PAGTO,
    VCN_CANCEL:req.body.VCN_CANCEL,
    VCN_VENDED:req.body.VCN_VENDED,
    VCN_PDV:req.body.VCN_PDV,
    VCN_USUARI:req.body.VCN_USUARI,
    VCN_DESCON:req.body.VCN_DESCON,
    VCN_ACRESC:req.body.VCN_ACRESC,
    VCN_CLIENT:req.body.VCN_CLIENT}
    try {
        const results = await Execsql`INSERT INTO "JVCN" ${ Execsql( params )} RETURNING "VCN_ID"`
        res.status(201).json(results)
    } catch (err) {
        res.status(500).json({ 'error': err })
    }
})
app.get("/token",async(req,res)=>{
    try {
        const results = await Execsql`SELECT "JTOK".*
         From "JTOK" 
         WHERE "TOK_USUARI" = ${ req.query.TOK_USUARI } 
         AND "TOK_CHAVE" = ${ req.query.TOK_CHAVE }
         AND "TOK_VALIDA" > now()
         ORDER by "TOK_ID" DESC
         LIMIT 1`
        res.status(200).json(results)
    } catch (err) {
        res.status(500).json({ 'error': err })
    }  
})
app.post("/token",async(req,res)=>{
    const params={
    TOK_USUARI:req.body.TOK_USUARI,
    TOK_CHAVE:req.body.TOK_CHAVE,
    TOK_VALIDA:req.body.TOK_VALIDA}
    try {
        const results = await Execsql`INSERT INTO "JTOK" ${ Execsql( params )} RETURNING "TOK_CHAVE"`
        res.status(201).json(results)        
    } catch (err) {
        res.status(500).json({ 'error': err })
    }
})
app.put("/token",async(req,res)=>{
     var c = Date.now()
     c = c + (req.body.TOK_VALIDA*6000)
    try {
        const results = await Execsql`UPDATE "JTOK" SET "TOK_VALIDA" = ${ c }  
        WHERE "TOK_CHAVE" = ${  req.body.TOK_CHAVE  }`
        res.status(201).json(results)
    } catch (err) {
        res.status(500).json({ 'error': err })
    }  
})
app.delete("/token",async(req,res)=>{
    try {
        const results = await Execsql`DELETE FROM "JTOK" WHERE "TOK_VALIDA" < now()`
        res.status(202).json(results)
    } catch (err) {
        res.status(500).json({ 'error': err })
    }  
})
app.get("/pagamento",async(req,res)=>{
    try {
        const results = await Execsql`SELECT * FROM "JPAG" ORDER BY "PAG_ID"`
        res.status(202).json(results)
    } catch (err) {
        res.status(500).json({ 'error': err })
    }  
})