(this.webpackJsonpphonebook=this.webpackJsonpphonebook||[]).push([[0],{14:function(e,n,t){e.exports=t(37)},36:function(e,n,t){},37:function(e,n,t){"use strict";t.r(n);var a=t(0),r=t.n(a),u=t(13),l=t.n(u),c=t(2),o=function(e){var n=e.message,t=e.notifType;return null===n?null:"success"===t?r.a.createElement("div",{className:"notifSuccess"},n):"error"===t?r.a.createElement("div",{className:"notifError"},n):void 0},i=function(e){var n=e.name,t=e.number,a=e.deletePerson;return r.a.createElement("div",null,n," ",t," ",r.a.createElement("button",{onClick:a},"delete"))},m=function(e){var n=e.persons,t=e.deletePersonWithID;return r.a.createElement("div",null,n.map((function(e){return r.a.createElement(i,{name:e.name,key:e.name,number:e.number,deletePerson:function(){return t(e.id,e.name)}})})))},s=function(e){var n=e.newName,t=e.newNumber,a=e.handleNewName,u=e.handleNewNumber,l=e.addPerson;return r.a.createElement("div",null,r.a.createElement("form",{onSubmit:l},r.a.createElement("div",null,"name: ",r.a.createElement("input",{value:n,onChange:a})),r.a.createElement("div",null,"number: ",r.a.createElement("input",{value:t,onChange:u})),r.a.createElement("div",null,r.a.createElement("button",{type:"submit"},"add"))))},d=function(e){var n=e.handleFilter;return r.a.createElement("div",null,"filter shown with ",r.a.createElement("input",{onChange:n}))},f=t(3),b=t.n(f),h="/api/persons",v=function(){return b.a.get(h).then((function(e){return e.data}))},E=function(e){return b.a.post(h,e).then((function(e){return e.data}))},p=function(e){return b.a.delete("".concat(h,"/").concat(e))},w=function(){var e=Object(a.useState)([]),n=Object(c.a)(e,2),t=n[0],u=n[1],l=Object(a.useState)(""),i=Object(c.a)(l,2),f=i[0],b=i[1],h=Object(a.useState)(""),w=Object(c.a)(h,2),N=w[0],j=w[1],O=Object(a.useState)(""),g=Object(c.a)(O,2),S=g[0],k=g[1],C=Object(a.useState)(null),P=Object(c.a)(C,2),y=P[0],I=P[1],T=Object(a.useState)(null),D=Object(c.a)(T,2),F=D[0],J=D[1];Object(a.useEffect)((function(){v().then((function(e){u(e)}))}),[]);var L=""===S?t:t.filter((function(e){return!0===e.name.toLowerCase().includes(S.toLowerCase())}));return r.a.createElement("div",null,r.a.createElement("h2",null,"Phonebook"),r.a.createElement(o,{message:y,notifType:F}),r.a.createElement(d,{handleFilter:function(e){k(e.target.value)}}),r.a.createElement("h3",null,"add a new"),r.a.createElement(s,{newName:f,newNumber:N,handleNewName:function(e){b(e.target.value)},handleNewNumber:function(e){j(e.target.value)},addPerson:function(e){e.preventDefault();var n={name:f,number:N};E(n).then((function(e){u(t.concat(e)),b(""),j(""),J("success"),I("Added ".concat(n.name)),setTimeout((function(){I(null),J(null)}),5e3)}))}}),r.a.createElement("h3",null,"Numbers"),r.a.createElement(m,{persons:L,deletePersonWithID:function(e,n){window.confirm("delete ".concat(n,"?"))?p(e).then((function(){u(t.filter((function(n){return n.id!==e})))})).catch((function(e){console.log(e),J("error"),I("Information of ".concat(n," has already been removed from server")),setTimeout((function(){I(null),J(null)}),5e3)})):console.log("Cancelled delete")}}))};t(36);l.a.render(r.a.createElement(w,null),document.getElementById("root"))}},[[14,1,2]]]);
//# sourceMappingURL=main.a4d6c23b.chunk.js.map