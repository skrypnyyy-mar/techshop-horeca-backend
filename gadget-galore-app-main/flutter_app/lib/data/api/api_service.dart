import 'dart:convert';
import 'package:http/http.dart' as http;
import 'package:shared_preferences/shared_preferences.dart';
import '../models/product.dart';

class ApiService {
  static final ApiService instance = ApiService._internal();
  ApiService._internal();

  static const String _baseUrl = "https://techshop-horeca-backend-production.up.railway.app";

  Future<String?> _getToken() async {
    final prefs = await SharedPreferences.getInstance();
    return prefs.getString('jwt_token');
  }

  Future<void> _saveToken(String token) async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.setString('jwt_token', token);
  }

  Future<void> _clearToken() async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.remove('jwt_token');
  }

  Map<String, String> _headers(String? token) {
    final headers = {'Content-Type': 'application/json'};
    if (token != null) {
      headers['Authorization'] = 'Bearer $token';
    }
    return headers;
  }

  Future<List<Product>> fetchProducts() async {
    final token = await _getToken();
    final response = await http.get(Uri.parse('$_baseUrl/products'), headers: _headers(token));
    return _processResponse<List<Product>>(response, (body) {
      final List<dynamic> jsonList = jsonDecode(body);
      return jsonList.map((e) => Product.fromJson(e)).toList();
    });
  }

  Future<void> addToCart(String productId, int quantity, {int? colorIndex}) async {
    final token = await _getToken();
    final payload = {
      'productId': productId,
      'quantity': quantity,
      if (colorIndex != null) 'colorIndex': colorIndex,
    };
    final response = await http.post(Uri.parse('$_baseUrl/cart'),
        headers: _headers(token), body: jsonEncode(payload));
    _processResponse<void>(response, (_) {});
  }

  Future<void> createOrder(Map<String, dynamic> orderData) async {
    final token = await _getToken();
    final response = await http.post(Uri.parse('$_baseUrl/order'),
        headers: _headers(token), body: jsonEncode(orderData));
    _processResponse<void>(response, (_) {});
  }

  /// Login returns the JWT token as a String.
  Future<String> login(String email, String password) async {
    final payload = {'email': email, 'password': password};
    final response = await http.post(Uri.parse('$_baseUrl/auth/login'),
        headers: _headers(null), body: jsonEncode(payload));
    return _processResponse<String>(response, (body) {
      final json = jsonDecode(body) as Map<String, dynamic>;
      final token = json['token'] as String;
      _saveToken(token);
      return token;
    });
  }

  Future<void> refreshToken() async {
    final token = await _getToken();
    if (token == null) return;
    final response = await http.post(Uri.parse('$_baseUrl/auth/refresh'), headers: _headers(token));
    _processResponse<void>(response, (body) {
      final json = jsonDecode(body) as Map<String, dynamic>;
      final newToken = json['token'] as String;
      _saveToken(newToken);
    });
  }

  T _processResponse<T>(http.Response response, T Function(String body) onSuccess) {
    if (response.statusCode == 200 || response.statusCode == 201) {
      return onSuccess(response.body);
    }
    if (response.statusCode == 401) {
      _clearToken();
      throw ApiException(401, 'Unauthorized');
    }
    if (response.statusCode == 409) {
      throw ApiException(409, 'Conflict: ${response.body}');
    }
    if (response.statusCode == 422) {
      throw ApiException(422, 'Unprocessable Entity: ${response.body}');
    }
    if (response.statusCode >= 500) {
      throw ApiException(500, 'Server error: ${response.body}');
    }
    throw ApiException(response.statusCode, 'Unexpected error: ${response.body}');
  }
}

class ApiException implements Exception {
  final int statusCode;
  final String message;
  ApiException(this.statusCode, this.message);
  @override
  String toString() => 'ApiException: $statusCode - $message';
}