# webglthreejs

update 21.12.23 15.00 - masa fps kontrolleri, duvar ve zemin texturelarını ekledim
ama odaya benzemedi.

update 22.12.23 17.19 - odaya benzedi ama mouse controlleri biraz jittery

update 24.12.23 00.16 - point light direct light ve ambient light ekledim. artık masanın gölgeleri var ve tüm materyaller ışığa duyarlı

update 24.12.23 01.07- lambayı değiştirip emit etmesi için sarı ısık ekledm daha iyi oldu

update 28.12.23 18.26 - cannon js kütüphanesi ile gravity ekledim. masanın collision shapeini ayarlamak kaldı. drag controller ile objeyi sürükleme var ama pointer lock ile calısmıyor. ve collision da direkt iptal etti. yarın çözmeyi denicem.

update 29.12.23 15.02 - collision shapelerini ayarladım. artık objeleri kutunun içine bıraktığında yok oluyor. fizikler ve gravity doğru calısıyor. objeyi tutup kaldırınca geri düşüyor.

update 30.12.23 16.15 - sahne geçişi çalışyor ama fps çok kötü. 4 - 5 civarında ve browserı feci kastırıyor. three'nin renderırını verdiğimde iyi calısıyodu ama o zaman da fizik ve collision updatelenmdi. ve renkler beyazlamıştı.

how to run:
install node.js ( install exe from node.js' webpage)

install npm by "npm install -g npm" in the command line
then "npm install vite" in the command line
then "npx vite" in the command line
finally open the localhost url
