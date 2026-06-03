import 'package:flutter/material.dart';
import 'package:shared_preferences/shared_preferences.dart';
import '../../data/api/api_service.dart';

class AuthNotifier extends ChangeNotifier {
  static final AuthNotifier instance = AuthNotifier._internal();

  AuthNotifier._internal();

  bool _isLoggedIn = false;
  String? _token;

  bool get isLoggedIn => _isLoggedIn;
  String? get token => _token;

  /// Load token from shared preferences on app start.
  Future<void> loadToken() async {
    final prefs = await SharedPreferences.getInstance();
    _token = prefs.getString('jwt_token');
    _isLoggedIn = _token != null;
    notifyListeners();
  }

  /// Login via API; stores token on success.
  Future<void> login(String email, String password) async {
    _token = await ApiService.instance.login(email, password);
    _isLoggedIn = true;
    notifyListeners();
  }

  /// Logout: clear stored token and reset state.
  Future<void> logout() async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.remove('jwt_token');
    _token = null;
    _isLoggedIn = false;
    notifyListeners();
  }
}
