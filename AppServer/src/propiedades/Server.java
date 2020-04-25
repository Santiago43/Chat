package propiedades;



import java.net.InetSocketAddress;
import java.util.ArrayList;
import java.util.List;
import java.util.Random;
import modelo.Cliente;

import org.java_websocket.WebSocket;
import org.java_websocket.handshake.ClientHandshake;
import org.java_websocket.server.WebSocketServer;
import org.json.JSONObject;


public class Server extends WebSocketServer{
//	private static Map<Integer,Set<WebSocket>> Rooms = new HashMap<>();
	private static List<Cliente> clients=new ArrayList();

    
    public Server() {
        super(new InetSocketAddress(30001));
    }

    @Override
    public void onOpen(WebSocket conn, ClientHandshake handshake) {
        System.out.println("New client connected: " + conn.getRemoteSocketAddress() + " hash " + conn.getRemoteSocketAddress().hashCode());
        Cliente cliente = new Cliente();
        cliente.setConn(conn);
        cliente.setHash(conn.getRemoteSocketAddress().hashCode()); 
        String object = "{\"tipo\":\"hash\",\"hash\":\""+cliente.getHash()+"\"}";
        conn.send(object);
        clients.add(cliente);
    }

    @Override
    public void onMessage(WebSocket conn, String message) {
        JSONObject obj = new JSONObject(message);
        String tipo = (String)obj.get("type"); 
         if (tipo.equals("ping")) {
            message="pong";
            conn.send(message); 
        }else if (tipo.equals("message")){
            this.sendToAll(conn,(String) obj.get("message")); 
        }
        else if(tipo.equals("nuevo")){
            String object = "{\"tipo\":\"conexion\",\"mensaje\":\"Se conectó: "+obj.get("user")+"}";
            this.sendToAll(conn, object);
        }
        else if(tipo.equals("private")){
            JSONObject priv = new JSONObject("mensaje");
            int hash = (int) priv.getInt("hash");
             for (int i = 0; i < clients.size(); i++) {
                 if(clients.get(i).getHash()==hash){
                     String object = "{\"tipo\":\"private\",\"nombre\":\""+priv.getString("nombre")+"\",\"mensaje:\""+priv.getString("mensaje")+"}";
                     clients.get(i).getConn().send(object);
                 }
             }
        }
        System.out.println((String) obj.get("message")); 
    }

    @Override
    public void onClose(WebSocket conn, int code, String reason, boolean remote) {
        System.out.println("Client disconnected: " + reason);
        for (int i = 0; i < clients.size(); i++) {
            if (clients.get(i).getConn().equals(i)) {
                clients.remove(i);
                break;
            }
        }
    }

    @Override
    public void onError(WebSocket conn, Exception exc) {
        System.out.println("Error happened: " + exc);
    }

    private int generateRoomNumber() {
        return new Random(System.currentTimeMillis()).nextInt();
    }

    private void sendToAll(WebSocket conn, String message) {
       /*
    	Iterator it = Rooms.get(myroom).iterator();
        while (it.hasNext()) {
            WebSocket c = (WebSocket)it.next();
            if (c != conn) c.send(message);
        }
        */
    	for(int i =0;i<clients.size();i++) {
    		WebSocket c = (WebSocket)clients.get(i).getConn();
            if (c != conn) c.send(message);
    	}
    }
    
    public static void main(String[] args) {
        Server server = new Server();
        server.start();
    }
    
    
}
