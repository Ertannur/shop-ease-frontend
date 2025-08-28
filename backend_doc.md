				Proje ile İlgili Bilinmesi Gerekenler

Base Url Adresi: https://eticaret-dgf7fgcehscsfka3.canadacentral-01.azurewebsites.net
Swagger Adresi: https://eticaret-dgf7fgcehscsfka3.canadacentral-01.azurewebsites.net/swagger/index.html
SignalR İstek Adresi: https://eticaret-dgf7fgcehscsfka3.canadacentral-01.azurewebsites.net/chatHub
Support Rolüne Sahip Kullanıcı Bilgisi : 
	Email: umutcanguncu@icloud.com
	Password: Umut135,
Not: Header:
	Authorization: Bearer token
Şeklinde yazan endpointlerde token bilgisi gönderilmesi zorunludur. 
Not: Harici olarak belirtilmediği sürece tüm token gönderilen enpointler admin ve user rolleri ile gerçekleştirilebilmektedir.
Not: Kayıt işlemi gerçekleştirildiği zaman varsayılan olarak User rolüne sahip olunmaktadır.
Not: Token bilgisi girilmesi gerekip girilmeden yapılan isteklerde 401 unauthorizate dönmektedir.
Not: Yetkisiz olmayan bir endpointe istek atıldığı zaman 403 dönmektedir. Örneğin Support rolüne sahip kullanıcı {baseUrl}/api/Adress/AddAdress endpointine post isteği atarsa.
Adress Controller

{baseUrl}/api/Adress/AddAdress

İstek Türü: Post
Header
Authorization: Bearer token bilgisi
Not: Token bilgisi girilmeden yapılan isteklerde 401 unauthorizate dönmektedir.
Kullanıcının adres bilgisinin veri tabanına kayıt edilmesini sağlamaktadır

Request Body: application/json
{
  "title": "Ev",
  "name": "string",
  "surname": "string",
  "email": "string@gmail.com",
  "phone": "05510876804",
  "address": "string",
  "city": "string",
  "district": "string",
  "postCode": "string"
}
			
		Response Body: application/json
		Code: 200 
{
  "success": true,
  "message": "Adres Bilgisi Başarıyla Eklendi"
}

Response Body: application/json
Code: 400

{
  "Message": "Validation error(s) occurred.",
  "Errors": {
    "Email": [
      "Email Adresi Zorunludur"
    ],
    "Phone": [
      "Telefon Numarasını Doğru Yazınız"
    ]
  }
}

{baseUrl}/api/Adress/GetUserAdress

İstek Türü: Get
Header:
Authorization: Bearer token bilgisi
Not: Token bilgisi girilmeden yapılan isteklerde 401 unauthorizate dönmektedir.
Not2: Query ya da request body’de herhangi bir parametre bilgisi girilmeden istek atılmaktadır.
Kullanıcının veri tabanında bulunmakta olan adreslerinin bilgilerini listelemektedir
		
		Request Url: {baseUrl}/api/Adress/GetUserAdress

Response body: application/json
Code: 200
[
  {
    "adressId": "d5fe4616-8e0b-4a14-e849-08dddfc88d30",
    "title": "Ev",
    "name": "string",
    "surname": "string",
    "email": "string@gmail.com",
    "phone": "05510958394",
    "address": "string",
    "city": "string",
    "district": "string",
    "postCode": "string"
  },
  {
    "adressId": "32652e32-fc9e-49c6-dc41-08dddfd17026",
    "title": "İş Yeri",
    "name": "Umutcan",
    "surname": "Güncü",
    "email": "umutcanguncu16@gmail.com",
    "phone": "05510876804",
    "address": "Eskimahakke",
    "city": "Bursa",
    "district": "Osmangazi",
    "postCode": "16360"
  }]
{baseUrl}/api/Adress/UpdateAdress
İstek Türü: Post
Header
Authorization: Bearer token bilgisi
Not: Token bilgisi girilmeden yapılan isteklerde 401 unauthorizate dönmektedir.
Kullanıcının adres bilgisinin veri tabanında güncellenmesini sağlamak

	Request Body: application/json

{
  "adressId": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
  "title": "string",
  "name": "string",
  "surname": "string",
  "email": "string",
  "phone": "string",
  "address": "string",
  "city": "string",
  "district": "string",
  "postCode": "string"
}

	Response Body : application/json
	Code: 200
{
  "success": true,
  "message": "Adres Bilgisi Başarıyla Güncellendi"
}

Response Body: application/json
Code: 400

{
  "Message": "Validation error(s) occurred.",
  "Errors": {
    "Email": [
      "Email Adresi Zorunludur"
    ],
    "Phone": [
      "Telefon Numarasını Doğru Yazınız"
    ]
  }
}

Response Body: application/json
Code: 400

{
  "success": false,
  "message": "Adres Bilgisi Güncellenemedi"
}

	

Auth Controller

1){baseUrl}/api/Auth/Login

İstek Türü: Post
Header: Header’da token bilgisi gönderilmeyecektir.
İstek Gerçekleştirebilecek Roller: Tüm roller istek gerçekleştirebilir. 
Amaç: Kullanıcının sisteme Giriş Yapabilmesini Sağlamaktır 

Request Body: application/json
{
“email": "burakyildiz0417@gmail.com",
  "password": "Burak123!"
}

Response body: application/json
Code: 200
{
  "success": true,
  "userId": "f47347e9-21ff-4472-10d0-08dddc1ccfef",
  "message": "Giriş İşlemi Başarıyla Gerçekleştirilmiştir",
  "token": {
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJmNDczNDdlOS0yMWZmLTQ0NzItMTBkMC0wOGRkZGMxY2NmZWYiLCJqdGkiOiIwNjJlN2ZhYy00NWE2LTRkMjktODc1ZC01NzFiZDViM2Q0ODgiLCJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9uYW1lIjoiYnVyYWt5aWxkaXowNDE3QGdtYWlsLmNvbSIsImh0dHA6Ly9zY2hlbWFzLm1pY3Jvc29mdC5jb20vd3MvMjAwOC8wNi9pZGVudGl0eS9jbGFpbXMvcm9sZSI6IlVzZXIiLCJuYmYiOjE3NTUyNzcyODIsImV4cCI6MTc1NTcwOTI4MiwiaXNzIjoiaHR0cHM6Ly9sb2NhbGhvc3Q6NzE2MyIsImF1ZCI6Imh0dHBzOi8vbG9jYWxob3N0OjcxNjMifQ.rpdIVujcWnQE1BWi_teVfhL02UrX29OR8rTnx5r2fwg",
    "expiration": "2025-08-20T17:01:22.8610053Z",
    "refreshToken": null
  }
}

Response body: application/json
Code: 400

{
  "Message": "Validation error(s) occurred.",
  "Errors": {
    "Email": [
      "Email Adresinizi Formatına Uygun Yazınız"
    ],
    "Password": [
      "Şifreniz Minimum 7 Karakter Olmalıdır"
    ]
  }
}

Response Body: application/json
Code: 400


{
  "success": false,
  "userId": null,
  "message": "Kullanıcı Bulunamadı",
  "token": null
}


2) {baseUrl}/api/Auth/RefreshTokenLogin

İstek Türü: Post
Header: Header’da token bilgisi gönderilmeyecektir.
İstek Gerçekleştirebilecek Roller: Tüm roller istek gerçekleştirebilir. 
Amaç: Kullanıcının sisteme refresh token bilgisi ile giriş Yapabilmesini Sağlamaktır 

Request Body: application/json

{
  "refreshToken": "string"
}
refreshToken: Elinizde bulunan refres token bilgisi

Response Body: application/json
Code: 200


{
  "success": true,
  "userId": "bdba4bf6-c1f1-437a-dd35-08dde4d5b38f",
  "message": "Giriş İşlemi Başarıyla Gerçekleştirilmiştir",
  "token": {
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJiZGJhNGJmNi1jMWYxLTQzN2EtZGQzNS0wOGRkZTRkNWIzOGYiLCJqdGkiOiJhYTZkZTIzMi1mZGNkLTQwMWUtOTMzMi0zNmQxODc3NzMxNjAiLCJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9uYW1lIjoidW11dGNhbmd1bmN1QGljbG91ZC5jb20iLCJodHRwOi8vc2NoZW1hcy5taWNyb3NvZnQuY29tL3dzLzIwMDgvMDYvaWRlbnRpdHkvY2xhaW1zL3JvbGUiOlsiVXNlciIsIlN1cHBvcnQiXSwibmJmIjoxNzU2Mjg5NzI0LCJleHAiOjE3NTY3MjE3MjQsImlzcyI6Imh0dHBzOi8vbG9jYWxob3N0OjcxNjMiLCJhdWQiOiJodHRwczovL2xvY2FsaG9zdDo3MTYzIn0.qORmSfl54qVrdW48gAg86zQC3NncDMMI7Fxj00-XsaA",
    "expiration": "2025-09-01T10:15:24.0586146Z",
    "refreshToken": "XbXklVMEiZLyhlZ2XA/PG0GEabtb5Vcxx75Ao73Gm6zrkZs2UwT/2ahbLJhejc+MRZGewXE5wzPrKJlz1qCgyw=="
  }


Response body: application/json
Status Code: 400
{
  "success": false,
  "userId": null,
  "message": "Refresh Token Süresi Geçmiştir",
  "token": null
}

Refresh token bilgisi geçersiz olduğu zaman response body
3){baseUrl}/api/Auth/Register

İstek Türü: Post
Header: Header’da token bilgisi gönderilmeyecektir.
İstek Gerçekleştirebilecek Roller: Tüm roller istek gerçekleştirebilir. 
Amaç: Kullanıcı Kaydı Gerçekleştirme

Requset Body: application/json
{
  "firstName": "Burak",
  "lastName": "Yıldız",
  "phoneNumber": "05050505050",
  "email": "burakyildiz0417@gmail.com",
  "password": "Burak123!",
  "dateOfBirth": "2002-07-13",
  "gender": 0
}
gender:
0 → Erkek
1 → Kadın

Tüm alanlar zorunludur. Şifre minimum güvenlik kriterlerini sağlamalıdır.

Response Body: application/json
{
"success": true,
  "message": "Kullanıcı Başarıyla Oluşturuldu"
}
	Dönen Kod:200 OK


4){baseUrl}/api/Auth/ForgotPassword

İstek Türü: Post
Header: Header’da token bilgisi gönderilmeyecektir.
İstek Gerçekleştirebilecek Roller: Tüm roller istek gerçekleştirebilir. 
Amaç: Kullanıcının E Posta adresine şifre sıfırlama bağlantısı göndermek

Request Body: application/json

{
  "email": "string"
}

Response Body: application/json
Code: 200


Response Body: application/json
Code: 400

{
  "success": false,
  "message": "İlgili E Posta Adresi Sistemimizde Kayıtlı Değildir"
}

Kullanıcı bilgisi sistemde bulunamazsa yukarıdaki gibi response dönmektedir.

5){baseUrl}/api/Auth/ResetPassword

İstek Türü: Post
Header: Header’da token bilgisi gönderilmeyecektir.
İstek Gerçekleştirebilecek Roller: Tüm roller istek gerçekleştirebilir. 
Amaç: Kullanıcının e postasına gelen token bilgisi ile birlikte şifre yenileme işlemlerini gerçekleştirmek.

Şifre yenileme işlemleri

RequestBody: application/json
{
  "email": "burakyildiz0417@gmail.com",
  "newPassword": "YeniSifre123!",
  "token": "abc123xyz"
} 
email: Şifre sıfırlanacak hesabın e-posta adresi
newPassword: Kullanıcının belirlediği yeni şifre
token: E-posta ile gelen doğrulama kodu veya linkten alınan token

!!!!!!! Bu token sadece şifre sıfırlama için geçerlidir. Oturum açmak için kullanılamaz.
Result Body: application/json
Code: 200
{
  "message": "Şifreniz başarıyla sıfırlandı."
}
Swagger’da “200 OK” yanıtı görünüyorsa işlem başarılıdır.














Basket Controller

{baseUrl}/api/Basket/GetBasketItems

İstek Türü: Post
Header
Authorization: Bearer token bilgisi
Not: Token bilgisi girilmeden yapılan isteklerde 401 unauthorizate dönmektedir.
Not2: Query ya da request body’de herhangi bir parametre bilgisi girilmeden istek atılmaktadır.
Amaç: Kullanıcının sepetinde bulunan ürünlerin listelenmesini sağlamaktadır.

Request Url: https://eticaret-dgf7fgcehscsfka3.canadacentral-01.azurewebsites.net/api/Basket/GetBasketItems

Response Body: application/json
Code: 200
 [
  {
    "basketItemId": "2948227a-6ba8-46f5-dd83-08dddfd691c6",
    "name": "Kadın Bluz 1",
    "price": 249.9,
    "quantity": 3,
    "imageUrl": null
  },
  {
    "basketItemId": "0ec96a8c-3c9a-41c2-dd84-08dddfd691c6",
    "name": "Çocuk Tişört 1",
    "price": 149.9,
    "quantity": 3,
    "imageUrl": null
  }
]

{baseUrl}/api/Basket/AddItemToBasket

İstek Türü: Post
Header
Authorization: Bearer token bilgisi
Not: Token bilgisi girilmeden yapılan isteklerde 401 unauthorizate dönmektedir.
Amaç: Ürünü sepete eklemek
RequestBody: application/json

{
  "productId": "a1526707-93ac-4b0e-9015-4e9c985891d6",
  "quantity": 3
}

ResponseBody: Herhangi bir response body verisi geri döndürülmez başarıyla eklendiği zaman.
Code: 200

Response Body: application/json
Code: 500
{
  "Message": "Beklenmeyen bir hata oluştu.",
  "Detail": "An error occurred while saving the entity changes. See the inner exception for details."
}


Not: Verilen productId yle ilişkili ürün veri tabanında bulunmazsa 500 dönecektir.
Not: {baseUrl}/api/Product/GetProducts endpointine get isteği atarak gelen ürün bilgilerinden herhangi birinin product Id sini kullanarak ekleme yaparsanız veri tabanında bulunan ürün bilgisiyle sepete ekleme yapılacağından hata almazsınız.

{baseUrl}/api/Basket/UpdateQuantity

İstek Türü: Post 
Header:
Authorization: Bearer token bilgisi
Not: Token bilgisi girilmeden yapılan isteklerde 401 unauthorizate dönmektedir.
Amaç: Sepetteki Ürün bigisini güncelleme
RequestBody: application/json

{
  "basketItemId": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
  "quantity": 0
}

ResponseBody: Herhangi bir response body verisi geri döndürülmez başarıyla eklendiği zaman.
Code: 200

Not basketItemId bilgisi {baseUrl}/api/Basket/GetBasketItems endpointine istek atılarak dönen responstaki basketItemId’den alınabilir

Response Body: application/json
Code: 400
{
  "type": "https://tools.ietf.org/html/rfc9110#section-15.5.1",
  "title": "Bad Request",
  "status": 400,
  "traceId": "00-e3afeca95a4351212ccae314077064f7-6d3d6a58eb0a9d91-00"
}








{baseUrl}/api/Basket/DeleteBasketItem


İstek Türü :Post 
Header:
Authorization: Bearer token bilgisi
Not: Token bilgisi girilmeden yapılan isteklerde 401 unauthorizate dönmektedir.
Amaç: Sepetten Ürün silme 

	RequestBody İçeriği: application/json
{
  "basketItemId": "3fa85f64-5717-4562-b3fc-2c963f66afa6"
}

ResponseBody: Herhangi bir response body verisi geri döndürülmez başarıyla eklendiği zaman.
Code: 200

Not basketItemId bilgisi {baseUrl}/api/Basket/GetBasketItems endpointine istek atılarak dönen responstaki basketItemId’den alınabilir

Response Body: application/json
Code: 400
{
  "type": "https://tools.ietf.org/html/rfc9110#section-15.5.1",
  "title": "Bad Request",
  "status": 400,
  "traceId": "00-e3afeca95a4351212ccae314077064f7-6d3d6a58eb0a9d91-00"
}


Not: BasketItemId bilgisi veri tabanında bulunmazsa 400 dönecektir




















Chat Controller

Not: Support rolüne sahip hesap bilgisi
Email:umutcanguncu@icloud.com
Password: Umut135,

Bu controller’ın amacı kullanıcı ile müşteri hizmetlerinin birbirleri arasında anlık mesajlaşmasını sağlamak ve ilgili mesajların veri tabanında depolanmasını sağlamaktır.

1){baseUrl}/api/Chat/GetChats

İstek Türü : Get
Header:
             Authorization : Bearer token bilgisi verilmesi gerekmektedir.
Hangi Roller İstek Gerçekleştirebilir: Admin, User, Support
Not: Token bilgisi girilmeden yapılan isteklerde 401 unauthorizate dönmektedir.
Query’de toUserId bilgisi gönderilmesi gerekmektedir.
ToUserId: Sohbet edilmek istenen kullanıcı bilgisi. User rolüne sahip biri için support rolüne sahip kullanıcı.  Support rolüne sahip olan biri için de user rolüne sahip kullanıcı

Request Url : {baseUrl}/api/Chat/GetChats?toUserId=6aee2cf4-bc84-4f59-8c69-25c5015e8090

Response: application/json
Code: 200

[
  {
    "id": "5f1234b3-834f-4ad2-977e-08dde4d96555",
    "userId": "b8ae0518-302b-446b-4516-08dddc9901d7",
    "toUserId": "bdba4bf6-c1f1-437a-dd35-08dde4d5b38f",
    "message": "merhaba",
    "createdDate": "2025-08-26T19:48:25.724658"
  },
  {
    "id": "a4a27dfd-b2aa-4921-977f-08dde4d96555",
    "userId": "bdba4bf6-c1f1-437a-dd35-08dde4d5b38f",
    "toUserId": "b8ae0518-302b-446b-4516-08dddc9901d7",
    "message": "deneme",
    "createdDate": "2025-08-26T19:48:29.068247"
  },
  {
    "id": "79ed1121-7311-43ad-9780-08dde4d96555",
    "userId": "b8ae0518-302b-446b-4516-08dddc9901d7",
    "toUserId": "bdba4bf6-c1f1-437a-dd35-08dde4d5b38f",
    "message": "selam",
    "createdDate": "2025-08-26T19:48:32.551367"
  }
]

id: chat tablosundaki uniq id
userId: İstek atan kullanıcının id’si
toUserId: Mesajlaşılan kullanıcının id’si
message: mesaj içeriği
createdDate: Mesajın gönderildiği tarih bilgisi


2){baseUrl}/api/Chat/GetUsers
Get isteği
Authorization : Bearer token bilgisi verilmesi gerekmektedir.
Hangi Roller İstek Gerçekleştirebilir: Admin, Support
Not: Token bilgisi girilmeden yapılan isteklerde 401 unauthorizate dönmektedir. İlgili rollere sahip bir kullanıcı istek atarsa 403 dönmektedir.
Bu endpointin amacı support veya admin rollerine sahip olan kişilerin mesajlaşabileceği kullanıcıyı seçebilmelerini sağlamaktır
Query’de herhangi bir bilgi girilmeden istek atılabilir

Request Url : {baseUrl}/api/Chat/GetUsers

Response: application/json
Code: 200
  {
    "id": "9a417e57-0034-41b8-794e-08ddddb50bbe",
    "fullName": "Burak Yıldız"
  },
  {
    "id": "f07787e6-dceb-4fd1-40aa-08dde0bc349a",
    "fullName": "Ert Den"
  },
  {
    "id": "cf650a47-ac7e-404f-177d-08dddcbd2af8",
    "fullName": "mehmet mehmetoğlu"
  },
  {
    "id": "13ba5a55-82d2-4a77-6916-08dde166a1e3",
    "fullName": "Mert Durmaz"
  }
]

id: kullanıcı id’si
fullName: Kullanıcıların isim ve soyisimleri



3){baseUrl}/api/Chat/GetSupport
Get isteği
Authorization : Bearer token bilgisi verilmesi gerekmektedir.
Hangi Roller İstek Gerçekleştirebilir: Admin, User
Not: Token bilgisi girilmeden yapılan isteklerde 401 unauthorizate dönmektedir. İlgili rollere sahip bir kullanıcı istek atarsa 403 dönmektedir.
Bu endpointin amacı user rolüne sahip kullanıcıların müşteri hizmetleri ile mesajlaşabilmesini sağlamaktır.
Query’de herhangi bir bilgi girilmeden istek atılabilir

Request Url : {baseUrl}/api/Chat/GetSupport



Response: application/json
Code: 200
[
  {
    "id": "bdba4bf6-c1f1-437a-dd35-08dde4d5b38f",
    "fullName": "Müşteri Hizmetleri"
  }
]
İd: müşteri hizmetlerinin id’si
fullName : Müşteri Hizmetleri

4){baseUrl}/api/Chat/SendMessage
Post isteği
Authorization : Bearer token bilgisi verilmesi gerekmektedir.
Hangi Roller İstek Gerçekleştirebilir: Admin, User, Support
Not: Token bilgisi girilmeden yapılan isteklerde 401 unauthorizate dönmektedir. İlgili rollere sahip bir kullanıcı istek atarsa 403 dönmektedir.
İlgili endpointin amacı mesaj göndermeyi ve veri tabanına kayıt etmeyi sağlamaktır.

Request Body: appliation/json
Code: 200
{
  "userId": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
  "toUserId": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
  "message": "string"
}

userId: Kullanıcının kendi Id Bilgisi
toUserId: Mesajlaşılacak kullanıcının Id bilgisi
message: Mesaj içeriği

Response: Başarılı olunca 200 döner response body bulunmamaktadır.





















Image Controller

{baseUrl}/api/Image/UploadImage

     İstek Türü: Post
     Header:
                  Authorization : Bearer token bilgisi verilmesi gerekmektedir.
Not: Token bilgisi girilmeden yapılan isteklerde 401 unauthorizate dönmektedir. İlgili rollere sahip bir kullanıcı istek atarsa 403 dönmektedir.
Amaç: Ürüne Resim eklemeyi sağlamaktadır
Not: Query’de productId bilgisi gerekmektedir.

Request Url: https://eticaret-dgf7fgcehscsfka3.canadacentral-01.azurewebsites.net/api/Image/UploadImage?ProductId=5b36244e-0027-471d-9ffe-c96d6fff8ae1

Request Body: multipart/form-data
Dosya yüklemesi yapılması gerekmektedir.

Response Body: application/json
Code: 200

{
  "success": true,
  "message": "Successfully added 1 images.",
  "productId": "5b36244e-0027-471d-9ffe-c96d6fff8ae1"
}

Response Body: application/json
Code: 500

{
  "Message": "Beklenmeyen bir hata oluştu.",
  "Detail": "An error occurred while saving the entity changes. See the inner exception for details."
}


















Order 
{baseUrl}/api/Order/CreateOrder

İstek Türü: Post 
Header
Authorization: Bearer token bilgisi
Not: Token bilgisi girilmeden yapılan isteklerde 401 dönmektedir.
Kullanıcının sepetindeki ürünlerle birlikte sipariş oluşturmasını sağlamaktadır.
Request Body: application/json
{
  "adressId": "3fa85f64-5717-4562-b3fc-2c963f66afa6"
}

ResponseBody: Herhangi bir response body verisi geri döndürülmez başarıyla eklendiği zaman.
Code: 200

ResponseBody: application/json
Code: 500

{
  "Message": "Beklenmeyen bir hata oluştu.",
  "Detail": "An error occurred while saving the entity changes. See the inner exception for details."
}

Verilen adres id’si veri tabanında bulunmazsa 500 döndürür

{baseUrl}/api/Order/ListCurrentUserOrders
İstek Türü:Get İsteği
Header
Authorization: Bearer token bilgisi
Not: Token bilgisi girilmeden yapılan isteklerde 401 unauthorizate dönmektedir.
Not2: Query ya da request body’de herhangi bir parametre bilgisi girilmeden istek atılmaktadır.
İlgili Kullanıcıya ait olan tüm siparişleri listemektedir.

Request Url: https://eticaret-dgf7fgcehscsfka3.canadacentral-01.azurewebsites.net/api/Order/ListCurrentUserOrders


Response Body: application/json
[
  {
    "orderId": "10ec23a4-2cb2-4304-5423-08ddde3add52",
    "orderDate": "2025-08-20T09:10:14.10015",
    "address": "string string string string",
    "products": [
      {
        "productId": "16e58483-5fb7-4f39-8e96-5e086ef99107",
        "productName": "Çocuk Ayakkabı 1",
        "quantity": 2,
        "totalPrice": 599.8
      },
      {
        "productId": "a1526707-93ac-4b0e-9015-4e9c985891d6",
        "productName": "Çocuk Tişört 1",
        "quantity": 2,
        "totalPrice": 299.8
      }
    ]
  },
  {
    "orderId": "cb9a9064-e6aa-4eb8-e67f-08dddfc968e3",
    "orderDate": "2025-08-20T10:09:58.971518",
    "address": "Eskimahakke Bursa Osmangazi 16360",
    "products": [
      {
        "productId": "43f2a4cd-85c0-4554-963b-93bf7876b513",
        "productName": "Kadın Bluz 1",
        "quantity": 2,
        "totalPrice": 499.8
      },
      {
        "productId": "afeab5db-178c-40e7-86c8-f9f420d4d653",
        "productName": "Jean Pantolon 2",
        "quantity": 3,
        "totalPrice": 1647
      }
    ]
  }
]










































Product Controller

{baseUrl}/api/Product/GetProducts

İstek Türü: Get
Header: Herhangi bir şey göndermeye gerek yok. 
Query’de currentPage, pageSize ve category bilgileri girilmeden de istek atılabilir.
currentPage: Kullanıcının bulunduğu sayfa sayısı
pageSize: Bir sayfada listenecek veri sayısı
category: Ürün kategorisi

Request Url: https://eticaret-dgf7fgcehscsfka3.canadacentral-01.azurewebsites.net/api/Product/GetProducts

Request Url: https://eticaret-dgf7fgcehscsfka3.canadacentral-01.azurewebsites.net/api/Product/GetProducts?category=erkek

Request Url: https://eticaret-dgf7fgcehscsfka3.canadacentral-01.azurewebsites.net/api/Product/GetProducts?currentPage=2&pageSize=8

Request Url: https://eticaret-dgf7fgcehscsfka3.canadacentral-01.azurewebsites.net/api/Product/GetProducts?currentPage=2&pageSize=8&category=erkek

Response Body: application/json
Code: 200

{
  "products": [
    {
      "productId": "59b3d693-8f4b-45d2-92da-788f89bbb986",
      "name": "Erkek Gömlek 1",
      "price": 349,
      "imageUrl": "https://guncufiles.blob.core.windows.net/photo-images/kirmizi.jpeg"
    },
    {
      "productId": "cbfa17a8-bee0-4c31-b44e-c4169555c6a2",
      "name": "Erkek Ayakkabı 1",
      "price": 599,
      "imageUrl": "https://guncufiles.blob.core.windows.net/photo-images/kirmizi.jpeg"
    },
    {
      "productId": "5b36244e-0027-471d-9ffe-c96d6fff8ae1",
      "name": "Erkek Mont 1",
      "price": 1199.9,
      "imageUrl": "https://guncufiles.blob.core.windows.net/photo-images/kirmizi.jpeg"
    },
    {
      "productId": "d3633048-2039-4c5e-9fec-cfbb5afb97af",
      "name": "Erkek Tişört 2",
      "price": 229.9,
      "imageUrl": "https://guncufiles.blob.core.windows.net/photo-images/kirmizi.jpeg"
    },
    {
      "productId": "b68d4cfa-7835-4f42-9420-e29cc10674d8",
      "name": "Erkek Tişört 1",
      "price": 199.9,
      "imageUrl": "https://guncufiles.blob.core.windows.net/photo-images/kirmizi.jpeg"
    }
  ],
  "totalPage": 1,
  "totalCount": 5,
  "hasPreviousPage": false,
  "hasNextPage": false
}

totalPage: toplam sayfa sayısı
totalCount: Toplam veri sayısı
hasPreviousPage: Önceki Sayfanın olup olmadığı bilgisi
hasNextPage: Sonraki sayfanın olup olmadığı bilgisi

2){baseUrl}/api/Product/GetProductById

İstek Türü: Get
Header: Herhangi bir şey göndermeye gerek yok. 
Query de id bilgisi gönderilmesi gerekmektedir
Amaç: Id si verilen ürünün detaylarını görüntülemek

Request Url: https://eticaret-dgf7fgcehscsfka3.canadacentral-01.azurewebsites.net/api/Product/GetProductById?id=b68d4cfa-7835-4f42-9420-e29cc10674d8

Response Body: application/json
Code: 200

{
  "productId": "B68D4CFA-7835-4F42-9420-E29CC10674D8",
  "title": "Erkek Tişört 1",
  "description": "Pamuklu beyaz erkek tişört\r",
  "price": 199.9,
  "stock": 0,
  "images": [
    "https://guncufiles.blob.core.windows.net/photo-images/kirmizi.jpeg"
  ],
  "details": []
}


2){baseUrl}/api/Product/GetFavoriteProducts

İstek Türü: Get
Header:
	Authorization: Bearer token
Not: Token bilgisi girilmeden yapılan isteklerde 401 unauthorizate dönmektedir.
Not2: Query ya da request body’de herhangi bir parametre bilgisi girilmeden istek atılmaktadır.

RequestUrl: https://eticaret-dgf7fgcehscsfka3.canadacentral-01.azurewebsites.net/api/Product/GetFavoriteProducts

Response Body: application/json
Code: 200

[
  {
    "productId": "b68d4cfa-7835-4f42-9420-e29cc10674d8",
    "title": "Erkek Tişört 1",
    "price": 199.9,
    "imageUrl": "https://guncufiles.blob.core.windows.net/photo-images/kirmizi.jpeg"
  }
]

{baseUrl}/api/Product/AddFavoriteProduct

İstek Türü: Post
Header:
	Authorization: Bearer token

Request Body: application/json

{
  "productId": "B68D4CFA-7835-4F42-9420-E29CC10674D8"
}

Response Body: application/json
Code: 200

{
  "success": true,
  "message": "Ürün Başarıyla Favoriye eklenmiştir",
  "productId": "b68d4cfa-7835-4f42-9420-e29cc10674d8"
}

Response Body: application/json
Code: 400

{
  "success": false,
  "message": "Ürün Hali Hazırda Favorilerde Bulunmaktadır",
  "productId": "b68d4cfa-7835-4f42-9420-e29cc10674d8"
}

{baseUrl}/api/Product/DeleteFavoriteProduct

İstek Türü: Post
Header:
	Authorization: Bearer token

Request Body: application/json

{
  "productId": "B68D4CFA-7835-4F42-9420-E29CC10674D8"
}

ResponseBody: Herhangi bir response body verisi geri döndürülmez başarılı olduğu zaman
Code: 200


ResponseBody: false
Code: 400


User Controller

1){baseUrl}/api/User/UpdateUser

İstek Türü: Post
Header:
	Authorization: Bearer token
Amaç: Kullanıcı Bilgilerini Güncelleme

Request Body: application/json
{
  "id": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
  "firstName": "string",
  "gender": 0,
  "lastName": "string",
  "dateOfBirth": "2025-08-27",
  "email": "string",
  "phoneNumber": "string",
  "password": "string"
}

Not: Şifre bilgisi ilglili endpointte değiştirilmemektedir. Şifre bilgisi doğru girilmediği sürece bilgiler güncellenmeyecektir

Response Body: application/json
Code: 200

{
  "success": true,
  "message": "Kullanıcı Bilgisi Başarıyla Güncellendi"
}

Response Body: application/json
Code: 400

{
  "success": false,
  "message": "Şifre Bilgisi Yanlış"
}

Response Body: application/json
Code: 400

{
  "Message": "Validation error(s) occurred.",
  "Errors": {
    "Password": [
      "Şifreniz Minimum 7 Karakter Olmalıdır.",
      "Şifreniz En Az Bir Sayı İçermeli."
    ]
  }
}


2){baseUrl}/api/User/GetUserById
İstek Türü: Get
Header:
	Authorization: Bearer token
Amaç: Kullanıcı Bilgilerini Görüntüleme
Query’de id bilgisinin girilmesi gerekmektedir. İd bilgisi kullanıcının id bilgisidir

Request Url: https://eticaret-dgf7fgcehscsfka3.canadacentral-01.azurewebsites.net/api/User/GetUserById?id=b8ae0518-302b-446b-4516-08dddc9901d7

Response Body: application/json
Code: 200

{
  "id": "b8ae0518-302b-446b-4516-08dddc9901d7",
  "firstName": "Umutcan",
  "gender": 0,
  "lastName": "Güncü",
  "dateOfBirth": "2002-08-16",
  "email": "umutcanguncu16@gmail.com",
  "phoneNumber": "05510876804"
}


3) {baseUrl}/api/User/ChangePassword
İstek Türü: Post
Header:
	Authorization: Bearer token
Amaç: Kullanıcı Şifresini Güncelleme

RequestBody: application/json

{
  "oldPassword": "string",
  "newPassword": "string"
}

Response Body: application/json
Code: 200

{
  "success": true,
  "message": "Şifreniz Başarıyla Güncellendi"
}

Response Body: application/json
Code: 400
{
  "success": false,
  "message": "Şifreniz Değiştirilemedi"
}




{baseUrl}/api/User/GetCurrentUser

İstek Türü: Get
Header:
	Authorization: Bearer token
Amaç: Giriş Yapmış olan kullanıcının bilgisini görüntüleme
Query’de herhangi bir bilgi girilmesine gerek yoktur.

Request Url: https://eticaret-dgf7fgcehscsfka3.canadacentral-01.azurewebsites.net/api/User/GetCurrentUser


Response Body: application/json
Code: 200

{
  "userId": "b8ae0518-302b-446b-4516-08dddc9901d7",
  "firstName": "Umutcan",
  "lastName": "Güncü",
  "email": "umutcanguncu16@gmail.com",
  "roles": [
    "User"
  ]
}




























SignalR Yapılandırması

SignalR bağlantısını çalıştırmak için istek atılması gereken url: {baseUrl}/chatHub

Güncel İstek Atılacak Url: https://eticaret-dgf7fgcehscsfka3.canadacentral-01.azurewebsites.net/chatHub

SinalR’da Kullanılan Motodlar

Örnek kodlar Angular kütüphanesi typescript kullanılarak yazılmıştır.

this.hub?.invoke("Connect", this.userId);

İlgili Kullanıcının UserId Bilgisi ile Connect Metoduna istek atılarak bağlantı açılır

this.hub?.on("Messages",(res:ChatModel)=> {
            console.log(res);    }


export class ChatModel{
  userId: string = "";
  toUserId: string = "";
  date: string  ="";
  message: string = "";
}


Anlık mesajları yakalayabilmek için Messages metodu dinlenir ve dönen bilgiler ChatModel’e atılır. Bu sayede sayfayı yenilemeye gerek kalmadan ilgili mesajlar dinlenebilir.