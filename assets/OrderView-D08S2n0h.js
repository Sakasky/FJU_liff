import{r as l,g,o as r,c as n,a as v,b as t,e as u,v as c,i as k,F as b,j as w,f as E,t as N,l as p,h as U}from"./index-CsIivTav.js";import{a as y}from"./axios-COvgDtyF.js";const V={key:0,class:"flex items-center justify-center m-auto pt-10"},P={key:1,class:"flex items-center justify-center flex-col p-10 text-center"},S=t("label",{for:"name"},"姓名",-1),j=t("label",{for:"phone"},"您的電話號碼",-1),O=t("label",{for:"issue"},"看診問題/備註事項",-1),R=t("label",{for:"doctor"},"約診醫生",-1),M=t("label",{for:"department"},"科別",-1),T=["value"],q=t("label",{for:"date"},"就診日",-1),A=t("label",{for:"notes"},"備註欄,或其他您方便約診的時間",-1),F=t("button",{type:"submit",class:"mt-4 w-full bg-blue-500 text-white px-4 py-2 rounded"},"送出",-1),H={key:2,class:"flex items-center justify-center flex-col p-10 text-center"},$=t("h1",{class:"text-2xl font-bold text-center"},"您尚未設定本裝置",-1),B={key:3,class:"flex items-center justify-center flex-col p-10 text-center"},L=t("p",null,"已完成預約",-1),W={__name:"Order",setup(_){const d=l(null),m={userid:"U14b5e7710fe33928351643793294dc3c"};console.log("userID",m.userid);const x=l(""),f=l(!1),i=l(!1);l(!1);const h=l(!0);l(!1),l(!1),l(!1),l(!1);const D=["ANES/麻醉疼痛科","BS/乳房外科","CM/胸腔內科","CVS/心臟血管外科","CRS/直腸外科","CS/胸腔外科","DERM/皮膚科","CV/心臟內科","Diet/營養諮詢","ENT/耳鼻喉科","FM/家庭醫學科","GI/胃腸肝膽科","GS/一般外科","GU/泌尿外科","OBGY/婦產科","HEMA/血液腫瘤科","NS/神經外科","INF/感染科","META/新陳代謝科","NEPH/腎臟內科","NEUR/神經內科","OPH/眼科","ORTH/骨科","PED/小兒科","PS/整形外科","PSY/精神科","REHA/復健科","IMRH/風濕免疫科","CADP/腹膜透析","心理諮商","PEDS/小兒外科"],s=l({method:"addOrder",personName:"",personPhone:"",issue:"",doctor:"",department:"",orderDate:"",notes:""}),C=()=>{s.method="addOrder",console.log("formData",s),y({method:"post",url:"https://script.google.com/macros/s/AKfycbxv0X4hKmjRsqICHL8WTa4nqpql6Rbq9w1njra_4jcFN-OcbZ4zxARyuyN9h2PCvvnB/exec",data:s,headers:{"Content-Type":"multipart/form-data"}}).then(a=>{d.value=a.data,console.log(a),h.value=!1,showCheckUserIDisExistㄡ.value=!1,finishOrder.value=!0}).catch(a=>{alert("預約失敗，請稍後再試或聯絡診所"),console.log(a)})},I=()=>{const a=new FormData;a.append("method","checkUserIDisExist"),a.append("userid",m.userid),y({method:"post",url:"https://script.google.com/macros/s/AKfycbxv0X4hKmjRsqICHL8WTa4nqpql6Rbq9w1njra_4jcFN-OcbZ4zxARyuyN9h2PCvvnB/exec",data:a,headers:{"Content-Type":"text/plain; charset=utf-8"}}).then(e=>{e.data.result==="useridisexist"?(x.value=e.data.personid,d.value=e.data,console.log("personID",x),f.value=!0):(f.value=!1,i.value=!0,d.value=e.data),h.value=!1}).catch(e=>{console.log(e),d.value=e.data})};return g(()=>{I()}),(a,e)=>(r(),n(b,null,[h.value?(r(),n("div",V," 讀取中 ")):v("",!0),f.value?(r(),n("div",P,[t("form",{class:"flex flex-col items-center p-4",onSubmit:e[7]||(e[7]=E(o=>C(),["prevent"]))},[S,u(t("input",{type:"text",id:"name","onUpdate:modelValue":e[0]||(e[0]=o=>s.value.personName=o),class:"border border-gray-300 rounded-md p-2"},null,512),[[c,s.value.personName]]),j,u(t("input",{class:"border border-gray-300 rounded-md p-2",type:"text",id:"phone","onUpdate:modelValue":e[1]||(e[1]=o=>s.value.personPhone=o)},null,512),[[c,s.value.personPhone]]),O,u(t("textarea",{class:"border border-gray-300 rounded-md p-2",id:"issue","onUpdate:modelValue":e[2]||(e[2]=o=>s.value.issue=o)},null,512),[[c,s.value.issue]]),R,u(t("input",{class:"border border-gray-300 rounded-md p-2",type:"text",id:"doctor","onUpdate:modelValue":e[3]||(e[3]=o=>s.value.doctor=o)},null,512),[[c,s.value.doctor]]),M,u(t("select",{class:"border border-gray-300 rounded-md p-2",id:"department","onUpdate:modelValue":e[4]||(e[4]=o=>s.value.department=o)},[(r(),n(b,null,w(D,o=>t("option",{value:o,key:o},N(o),9,T)),64))],512),[[k,s.value.department]]),q,u(t("input",{class:"border border-gray-300 rounded-md p-2",type:"date",id:"date","onUpdate:modelValue":e[5]||(e[5]=o=>s.value.orderDate=o)},null,512),[[c,s.value.orderDate]]),A,u(t("textarea",{class:"border border-gray-300 rounded-md p-2",id:"notes","onUpdate:modelValue":e[6]||(e[6]=o=>s.value.notes=o)},null,512),[[c,s.value.notes]]),F],32)])):v("",!0),i.value?(r(),n("div",H,[$,t("button",{onClick:e[8]||(e[8]=o=>a.$router.push("/"))},"前往設定")])):v("",!0),a.finishOrder?(r(),n("div",B,[L,t("button",{onClick:e[9]||(e[9]=o=>a.$emit("close-window")),class:"mt-4 bg-blue-500 text-white px-4 py-2 rounded"},"確認")])):v("",!0)],64))}},G={class:"text-xl"},K={key:0,class:"text-center"},Y={__name:"OrderView",setup(_){const d=l(!1),m=l(null),x=l(null);g(async()=>{p.init({liffId:"1657869644-jDxqpoMV"}).then(()=>{p.isLoggedIn()&&(d.value=p.isLoggedIn(),m.value=p.getDecodedIDToken().sub,x.value=p.getDecodedIDToken().email)}).catch(i=>{console.log(i.code,i.message)})});const f=()=>{p.closeWindow()};return(i,h)=>(r(),n("div",G,[d.value?(r(),n("p",K)):v("",!0),U(W,{onCloseWindow:f,userid:m.value},null,8,["userid"])]))}};export{Y as default};
