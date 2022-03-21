package com.company;

import java.io.BufferedReader;
import java.io.FileNotFoundException;
import java.io.FileReader;
import java.io.IOException;
import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.PreparedStatement;
import java.sql.SQLException;
import java.time.LocalDate;
import java.util.*;
import java.util.stream.Collectors;

import com.google.gson.Gson;

import org.json.simple.parser.JSONParser;
import org.json.simple.parser.ParseException;

public class Main {
    List<Movie> movies = new ArrayList<>();
    List<String> dbIdList = new ArrayList<>();
    static List<LocalDate> dates = new ArrayList<>();

    int[] theaterIds = {1, 2, 3};
    String[] times = {"11:00", "13:30", "16:45", "17:30", "21:15", "22:00"};
    String[] movieIds = {"tt0050083", "tt0071562", "tt0108052", "tt0060196", "tt0109830", "tt0102926", "tt0468569", "tt0099685", "tt0137523", "tt0118799", "tt0047478", "tt0114369", "tt0038650", "tt0073486", "tt0088763", "tt0034583"};
    static LocalDate start = LocalDate.of(2022, 04, 21);
    static LocalDate end = LocalDate.of(2022, 07, 21);


    public static void main(String[] args) {
        dates = getDates(start, end);
        connect();
    }

    public static List<LocalDate> getDates(LocalDate startDate, LocalDate endDate) {

        return startDate.datesUntil(endDate)
                .collect(Collectors.toList());
    }

    public static void connect() {
        Main myApp = new Main();
        Connection conn = null;
        try {
            // db parameters
            String url = "jdbc:sqlite:C:\\Users\\olsso\\Documents\\GitHub\\Asteria\\backend\\database\\cinemaDb.sqlite3";
            // create a connection to the database
            conn = DriverManager.getConnection(url);

            System.out.println("Connection to SQLite has been established.");

            // myApp.jsonParserFromString();
            myApp.screeningInserter(conn);

        } catch (SQLException e) {
            System.out.println(e.getMessage());
        } catch (IOException e) {
            e.printStackTrace();
        } finally {
            try {
                if (conn != null) {
                    conn.close();
                }
            } catch (SQLException ex) {
                System.out.println(ex.getMessage());
            }
        }
    }

    public void jsonParserFromString() {
        Gson gson = new Gson();
        JSONParser jsonParser = new JSONParser();

        try (FileReader reader = new FileReader("C:\\Users\\olsso\\IdeaProjects\\sqlite_inserter\\src\\com\\company\\movies.json")) {

            String movieList = jsonParser.parse(reader).toString();

            movies.addAll(Arrays.stream(gson.fromJson(movieList, Movie[].class)).toList());

        } catch (FileNotFoundException e) {
            e.printStackTrace();
        } catch (IOException e) {
            e.printStackTrace();
        } catch (ParseException e) {
            e.printStackTrace();
        }
    }

    public void movieInserter(Connection conn) throws IOException, SQLException {

        BufferedReader fileReader = new BufferedReader(new FileReader("C:\\Users\\olsso\\IdeaProjects\\sqlite_inserter\\src\\com\\company\\movieIDS.txt"));
        String line = fileReader.readLine();

        while (line != null) {
            dbIdList.add(line);
            line = fileReader.readLine();
        }

        for (int movieListIncre = 0; movieListIncre < movies.size(); movieListIncre++) {
            int idListIncre;
            System.out.println(movies.get(movieListIncre).getTitle());
            for (idListIncre = 0; idListIncre < dbIdList.size(); idListIncre++) {
                if (movies.get(movieListIncre).getImDbId().equals(dbIdList.get(idListIncre))) {
                    String sql = "INSERT INTO movies(movieId, title, plot, thumbnailUrl, link) VALUES(?,?,?,?,?)";
                    PreparedStatement pstmt = conn.prepareStatement(sql);
                    pstmt.setString(1, movies.get(movieListIncre).getImDbId());
                    pstmt.setString(2, movies.get(movieListIncre).getTitle());
                    pstmt.setString(3, movies.get(movieListIncre).getPlot());
                    pstmt.setString(4, movies.get(movieListIncre).getThumbnailUrl());
                    pstmt.setString(5, movies.get(movieListIncre).getLink());
                    pstmt.executeUpdate();
                    dbIdList.remove(idListIncre);
                    movies.remove(movieListIncre);
                    break;
                }
            }
        }
    }

    public void screeningInserter(Connection conn) throws IOException, SQLException {
        int randScreening;
        Random random = new Random();
        for (LocalDate date : dates) {

            for (int theaterId : theaterIds) {

                for (int screeningListIncre = 0; screeningListIncre < 3; screeningListIncre++) {

                    randScreening = (int) Math.round(Math.random());

                    String sql = "INSERT INTO screenings(date, time, theaterId, movieId) VALUES(?,?,?,?)";
                    PreparedStatement pstmt = conn.prepareStatement(sql);
                    pstmt.setString(1, date.toString());
                    pstmt.setString(2, times[(screeningListIncre * 2) + randScreening]);
                    pstmt.setString(3, String.valueOf(theaterId));
                    pstmt.setString(4, movieIds[random.nextInt(movieIds.length)]);
                    pstmt.executeUpdate();
                }
            }
        }
    }
}
