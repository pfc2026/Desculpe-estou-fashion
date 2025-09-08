import 'dart:io';
import 'dart:math';

void main() {
  double saldo = 100.0; // Saldo inicial
  double valorAposta = 1.0; // Valor mínimo de aposta
  
  print('\x1B[2J\x1B[0;0H'); // Limpa a tela
  print('🐯 Bem-vindo ao Tigrinho! 🐯');
  print('Seu saldo inicial: R\$ $saldo\n');
  
  while (saldo > 0) {
    print('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    print('Saldo atual: R\$ ${saldo.toStringAsFixed(2)}');
    print('Valor da aposta: R\$ ${valorAposta.toStringAsFixed(2)}');
    print('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
    
    print('Comandos:');
    print('[ ENTER ] - Girar');
    print('[ + ] - Aumentar aposta');
    print('[ - ] - Diminuir aposta');
    print('[ S ] - Sair');
    
    // Vez do jogador
    print('\nVez do Jogador $jogadorAtual');
    var jogadaValida = false;
    
    while (!jogadaValida) {
      stdout.write('Linha (1-3): ');
      var linha = int.tryParse(stdin.readLineSync() ?? '') ?? 0;
      stdout.write('Coluna (1-3): ');
      var coluna = int.tryParse(stdin.readLineSync() ?? '') ?? 0;
      
      // Verifica se a jogada é válida
      if (linha >= 1 && linha <= 3 && coluna >= 1 && coluna <= 3) {
        linha--; // Ajusta para índice 0-2
        coluna--;
        
        if (tabuleiro[linha][coluna] == ' ') {
          tabuleiro[linha][coluna] = jogadorAtual;
          jogadaValida = true;
        } else {
          print('\n❌ Posição já ocupada! Tente novamente.');
        }
      } else {
        print('\n❌ Posição inválida! Use números de 1 a 3.');
      }
    }
    
    // Verifica se alguém ganhou
    if (verificarVitoria(tabuleiro, jogadorAtual)) {
      print('\x1B[2J\x1B[0;0H'); // Limpa a tela
      mostrarTabuleiro(tabuleiro);
      print('\n🎉 Parabéns! Jogador $jogadorAtual venceu! 🎉');
      jogoAcabou = true;
    } 
    // Verifica empate
    else if (tabuleiroCompleto(tabuleiro)) {
      print('\x1B[2J\x1B[0;0H'); // Limpa a tela
      mostrarTabuleiro(tabuleiro);
      print('\n😅 Empate! O jogo acabou empatado!');
      jogoAcabou = true;
    }
    
    // Troca o jogador
    jogadorAtual = jogadorAtual == 'X' ? 'O' : 'X';
  }
  
  print('\nDeseja jogar novamente? (S/N)');
  var resposta = stdin.readLineSync()?.toLowerCase() ?? 'n';
  if (resposta == 's') {
    print('\x1B[2J\x1B[0;0H'); // Limpa a tela
    main();
  } else {
    print('\nObrigado por jogar! 👋');
  }
}

void mostrarTabuleiro(List<List<String>> tabuleiro) {
  print('     1   2   3');
  print('   ┌───┬───┬───┐');
  for (var i = 0; i < 3; i++) {
    print(' ${i + 1} │ ${tabuleiro[i][0]} │ ${tabuleiro[i][1]} │ ${tabuleiro[i][2]} │');
    if (i < 2) print('   ├───┼───┼───┤');
  }
  print('   └───┴───┴───┘');
}

bool verificarVitoria(List<List<String>> tabuleiro, String jogador) {
  // Verifica linhas
  for (var i = 0; i < 3; i++) {
    if (tabuleiro[i][0] == jogador && 
        tabuleiro[i][1] == jogador && 
        tabuleiro[i][2] == jogador) {
      return true;
    }
  }
  
  // Verifica colunas
  for (var i = 0; i < 3; i++) {
    if (tabuleiro[0][i] == jogador && 
        tabuleiro[1][i] == jogador && 
        tabuleiro[2][i] == jogador) {
      return true;
    }
  }
  
  // Verifica diagonais
  if (tabuleiro[0][0] == jogador && 
      tabuleiro[1][1] == jogador && 
      tabuleiro[2][2] == jogador) {
    return true;
  }
  
  if (tabuleiro[0][2] == jogador && 
      tabuleiro[1][1] == jogador && 
      tabuleiro[2][0] == jogador) {
    return true;
  }
  
  return false;
}

bool tabuleiroCompleto(List<List<String>> tabuleiro) {
  for (var linha in tabuleiro) {
    for (var celula in linha) {
      if (celula == ' ') return false;
    }
  }
  return true;
}
